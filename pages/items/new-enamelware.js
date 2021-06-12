import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {Button, FlexboxGrid, Notification} from "rsuite";

import NewEnamelwareForm from "../../components/forms/NewEnamelwareForm";

import { parseCookies } from "../../lib/parseCookies";
import StoreService from "../../services/Store";
import MeasureService from "../../services/Measure";

import "../../styles/forms.less";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";
import {useRouter} from "next/router";
import AxiosService from "../../services/Axios";
import routes from "../../config/routes";

export default function NewEnamelwarePage({
  handleLogged,
  handleUser,
  isError,
  user,
  stores,
  materials,
  sizes
}) {
  const router = useRouter();
  const { handleSubmit, errors, control, register } = useForm();
  const [isOpen, handleIsOpen] = useState(false);
  const [isLoading, handleLoading] = useState(false);
  const [storeItemData, setStoreItemData] = useState([]);
  const [quantityValue, setQuantity] = useState('');

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
      type: "enamelware",
      quantity: data.quantity,
      unitQuantity: data.unitQuantity,
      price: `${data.priceCurrency} ${data.price}`,
      userId: user.user._id,
      disabled: false
    };
    const enamelwareData = {
      size: `${data.size1Number}${data.size1Measure}${data.size2Number ? 'x' + data.size2Number + data.size2Measure : ""}`,
      material: data.material,
    };

    try {
      const item = await AxiosService.instance.post(routes.items, itemData, {
        headers: {
          Authorization: user.token,
        },
      });

      await AxiosService.instance.post(
        routes.items + "/enamelware",
        { ...enamelwareData, itemId: item.data },
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
        title: "Nuevo Utencilio",
        description: "Utencilio agregado con exito",
        placement: "bottomStart",
        duration: 9000,
      });
      handleLoading(false);
      history.push("/items");
    } catch (err) {
      Notification.error({
        title: "Error",
        description: err.response.data.message,
        placement: "bottomStart",
        duration: 9000,
      });
      console.error(err.response.data.message);
      handleLoading(false);
    }
  };

  return (
    <>
      <FlexboxGrid className="form" justify="space-between">
        <FlexboxGrid.Item colspan={24} style={{ marginBottom: "3rem" }}>
          <h3 className="text-bolder">Nuevo Utencilio</h3>
          <span>Paso 1/1</span>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <NewEnamelwareForm
            token={user.token}
            register={register}
            errors={errors}
            control={control}
            storeItemData={[storeItemData, setStoreItemData]}
            quantityData={[quantityValue, setQuantity]}
            sizes={sizes}
            stores={stores}
            materialsData={materials}
          />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item
          colspan={15}
          style={{ marginBottom: "2rem", marginTop: "2rem" }}
        />
        <FlexboxGrid.Item
          colspan={4}
          style={{ marginBottom: "2rem", marginTop: "2rem" }}
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
          style={{ marginBottom: "2rem", marginTop: "2rem" }}
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
    stores = [],
    measures = [], sizes = [], materials = [];
  const cookies = parseCookies(req);

  if (cookies && cookies.sialincaUser) {
    try {
      user = JSON.parse(cookies.sialincaUser);

      stores = await StoreService.getStores({});
      stores = stores.map((store) => ({ ...store, _id: store._id.toString() }));

      measures = await MeasureService.getMeasures({});
      measures.map(measure => {
        if(measure.name === "enamelwareMaterials") {
          materials = measure.measures;
        }
        if(measure.name === "enamelwareSizes" || measure.name === "metro") {
          sizes.push(...measure.measures);
        }
      })

      return {
        props: {
          user,
          stores,
          materials,
          sizes,
          isError: false,
        },
      };
    } catch (err) {
      return {
        props: {
          user,
          stores,
          materials: measures ? measures[0].measures : [],
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
