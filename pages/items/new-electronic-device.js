import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {Button, FlexboxGrid, Notification} from "rsuite";

import NewElectronicDeviceForm from "../../components/forms/NewElectronicDeviceForm";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";

import { parseCookies } from "../../lib/parseCookies";
import StoreService from "../../services/Store";
import MeasureService from "../../services/Measure";

import "../../styles/forms.less";
import AxiosService from "../../services/Axios";
import routes from "../../config/routes";

export default function NewElectronicDevicePage({
  handleLogged,
  handleUser,
  isError,
  user,
  stores,
  marks,
  types,
}) {
  const router = useRouter();
  const { handleSubmit, errors, control, register, setError } = useForm();
  const [isLoading, handleLoading] = useState();
  const [isOpen, handleIsOpen] = useState(false);
  const [storeItemData, setStoreItemData] = useState([]);
  const [deviceCharacteristics, setDeviceCharacteristics] = useState([]);
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
    debugger;
    handleLoading(true);

    if(!deviceCharacteristics.length) {
      setError("characteristics",
        {
          type: "empty",
          message: "Debe de existir por lo menos una característica del dispositivo electrónico",
          shouldFocus: false
        })
      handleLoading(false);
      return;
    }

    const itemData = {
      name: data.name,
      type: "stationary",
      quantity: data.quantity,
      unitQuantity: data.unitQuantity,
      price: `${data.priceCurrency} ${data.price}`,
      userId: user.user._id,
      disabled: false
    };
    const electroDeviceData = {
      deviceType: data.deviceType,
      serial: data.serial,
      mark: data.mark,
      model: data.model,
      characteristics: deviceCharacteristics
    };

    try {
      const item = await AxiosService.instance.post(routes.items, itemData, {
        headers: {
          Authorization: user.token,
        },
      });

      await AxiosService.instance.post(
        routes.items + "/electro-devices",
        { ...electroDeviceData, itemId: item.data },
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
        title: "Nuevo Dispoitivo Electrónico",
        description: "Dispoitivo Electrónico agregado con exito",
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
          <h3 className="text-bolder">Nuevo Dispositivo Electrónico</h3>
          <span>Paso 1/1</span>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <NewElectronicDeviceForm
            errors={[errors, setError]}
            register={register}
            control={control}
            stores={stores}
            marks={marks}
            types={types}
            token={user.token}
            storeData={[storeItemData, setStoreItemData]}
            quantityData={quantity}
            deviceCharacteristics={[deviceCharacteristics, setDeviceCharacteristics]}
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
    stores,
    measures,
    marks = [],
    types = [];
  const cookies = parseCookies(req);

  if (cookies && cookies.sialincaUser) {
    try {
      user = JSON.parse(cookies.sialincaUser);

      stores = await StoreService.getStores({});
      stores = stores.map((store) => ({ ...store, _id: store._id.toString() }));

      measures = await MeasureService.getMeasures({});
      measures.map((measure) => {
        if (measure.name === "electroDeviceMarks") {
          marks = measure.measures;
        }
        if (measure.name === "electroDeviceTypes") {
          types = measure.measures;
        }
      });

      return {
        props: {
          user,
          stores,
          marks,
          types,
          isError: false,
        },
      };
    } catch (err) {
      return {
        props: {
          user,
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
