import { useState, useEffect } from "react";
import {Button, FlexboxGrid, Notification} from "rsuite";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import NewPropertyForm from "../../components/forms/NewPropertyForm";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";

import { parseCookies } from "../../lib/parseCookies";
import StoreService from "../../services/Store";
import MeasureService from "../../services/Measure";

import "../../styles/forms.less";
import AxiosService from "../../services/Axios";
import routes from "../../config/routes";

export default function NewPropertyPage({
  handleLogged,
  handleUser,
  isError,
  user,
  stores,
  marks,
  materials,
}) {
  const router = useRouter();
  const { handleSubmit, errors, control, register } = useForm();
  const [isLoading, handleLoading] = useState();
  const [isOpen, handleIsOpen] = useState(false);
  const [storeItemData, setStoreItemData] = useState([]);
  const quantity = useState(0);

  useEffect(() => {
    if (isError) {
    }
    handleLogged(true);
    handleUser(user);
  });

  const onHide = () => {
    handleIsOpen(false);
  };

  const onOpen = () => {
    handleIsOpen(true);
  };

  const onConfirmCancel = () => {
    router.push("/items");
  };

  const onSubmit = async (data) => {
    handleLoading(true);

    const itemData = {
      name: data.name,
      type: "property",
      quantity: data.quantity,
      unitQuantity: data.unitQuantity,
      price: `${data.priceCurrency} ${data.price}`,
      userId: user.user._id,
      disabled: false
    };
    const propertyData = {
      description: data.description,
      serial: data.serial,
      model: data.model,
      mark: data.mark,
      material: data.material,
      addressLine: data.addressLine,
      addressCountry: data.addressCountry,
      addressCity: data.addressCity,
      addressState: data.addressState,
      addressZipcode: data.zipCode,
    };

    try {
      const item = await AxiosService.instance.post(routes.items, itemData, {
        headers: {
          Authorization: user.token,
        },
      });

      await AxiosService.instance.post(
        routes.items + "/properties",
        { ...propertyData, itemId: item.data },
        {
          headers: {
            Authorization: user.token,
          },
        }
      );

      storeItemData.map(async (store) => {
        await AxiosService.instance.post(
          routes.getStores + `/${store.storeId}/items`,
          [{ itemId: item.data, quantity: store.quantity }],
          {
            headers: {
              Authorization: user.token,
            },
          }
        );
      });

      Notification.success({
        title: "Nueva Inmueble",
        description: "Inmueble agregado con exito",
        placement: "bottomStart",
        duration: 9000,
      });
      handleLoading(false);
      history.push("/items");
    } catch (err) {
      Notification.error({
        title: "Error",
        description: err?.response?.data,
        placement: "bottomStart",
        duration: 9000,
      });
      handleLoading(false);
    }
  };

  return (
    <>
      <FlexboxGrid justify="space-between">
        <FlexboxGrid.Item colspan={24} style={{ marginBottom: "2em" }}>
          <h3 className="text-bolder">Nuevo Inmueble</h3>
          <span>Paso 1/1</span>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <NewPropertyForm
            errors={errors}
            register={register}
            control={control}
            stores={stores}
            storeData={[storeItemData, setStoreItemData]}
            quantityData={quantity}
            marks={marks}
            materials={materials}
            token={user.token}
          />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item
          colspan={15}
          style={{ margin: "2rem 0" }}
        />
        <FlexboxGrid.Item
          colspan={4}
          style={{ margin: "2rem 0" }}
        >
          <Button
            block
            appearance="default"
            className="button shadow bg-color-white text-medium text-black"
            onClick={onOpen}
          >
            Cancelar
          </Button>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item
          colspan={4}
          style={{ margin: "2rem 0" }}
        >
          <Button
            block
            className="button shadow text-medium bg-color-primary text-white"
            onClick={handleSubmit(onSubmit)}
            loading={isLoading}
            appearance="primary"
          >
            Finalizar
          </Button>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <CancelConfirmationModal
        isOpen={isOpen}
        onHide={onHide}
        onHandleCloseConfirmationModal={onConfirmCancel}
        handleOpen={handleIsOpen}
      />
    </>
  );
}

export async function getServerSideProps({ req, params }) {
  let user = {},
    stores,
    measures,
    marks = [],
    materials = [];
  const cookies = parseCookies(req);

  if (cookies && cookies.sialincaUser) {
    try {
      user = JSON.parse(cookies.sialincaUser);

      stores = await StoreService.getStores({});
      stores = stores.map((store) => ({ ...store, _id: store._id.toString() }));

      measures = await MeasureService.getMeasures({});
      measures.map((measure) => {
        if (measure.name === "propertyMarks") {
          marks = measure.measures;
        }
        if (measure.name === "propertyMaterials") {
          materials = measure.measures;
        }
      });

      return {
        props: {
          user,
          stores,
          marks,
          materials,
          isError: false,
        },
      };
    } catch (err) {
      return {
        props: {
          user,
          stores,
          isError: true,
        },
      };
    }
  }
  return {
    redirect: {
      permanent: false,
      destination: "/login",
    },
    props: {},
  };
}
