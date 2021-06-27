import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {Button, FlexboxGrid, Notification} from "rsuite";

import NewElectronicDeviceForm from "../../components/forms/NewElectronicDeviceForm";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";

import { parseCookies } from "../../lib/parseCookies";
import StoreService from "../../services/Store";
import MeasureService from "../../services/Measure";
import AxiosService from "../../services/Axios";
import routes from "../../config/routes";

import "../../styles/forms.less";
import FormErrorMessage from "../../components/common/FormErrorMessage";

export default function NewElectronicDevicePage({
  handleLogged,
  handleUser,
  isError,
  user,
  stores,
  marks,
  types,
}) {
  const history = useRouter();
  const { id, childId } = history.query;
  const { handleSubmit, errors, register, control, setError, clearErrors } = useForm();
  const [isLoading, handleLoading] = useState();
  const [isOpen, handleIsOpen] = useState(false);
  const [storeItemData, setStoreItemData] = useState([]);
  const [deviceCharacteristics, setDeviceCharacteristics] = useState([]);


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
    history.push("/items");
  };

  const onSubmit = async (data) => {
    if(!deviceCharacteristics.length) {
      setError("characteristics",
        {
          type: "empty",
          message: "Debe de existir por lo menos una característica del dispositivo electrónico",
          shouldFocus: false
        })
      setTimeout(() => {
        clearErrors("characteristics")
      }, 3000);
      return;
    }

    if(!storeItemData.length) {
      setError("storeData", {
        message: "El item debe estar por lo menos en un almacén"
      })

      setTimeout(() => {
        clearErrors("storeData")
      }, 3000);
      return;
    }

    const quantityCheck = storeItemData.reduce((accum, item) => {
      return { quantity: accum.quantity + item.quantity }
    })

    if(quantityCheck.quantity !== data.quantity){
      setError("quantityValue", {
        message: "La suma de todos los almacenes agregados debe ser igual al valor en el campo 'Cantidad'"
      })
      setTimeout(() => {
        clearErrors("quantityValue")
      }, 3000);
      return;
    }

    handleLoading(true);

    const itemData = {
      name: data.name,
      type: "electroDevice",
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
      if(id) {
        await AxiosService.instance.put(routes.items + "/" + id, itemData, {
          headers: {
            Authorization: user.token,
          },
        });

        await AxiosService.instance.put(
          routes.items + "/electro-devices/" + childId,
          electroDeviceData,
          {
            headers: {
              Authorization: user.token
            },
          }
        );

        storeItemData.map(async (store) => {
          const storeItems = stores.filter(myStore => myStore._id === store.storeId)[0].items;
          await AxiosService.instance.put(
            routes.getStores + `/${store.storeId}/items`,
            storeItems.map(storeItem => storeItem.itemId !== id ? { itemId: id, quantity: store.quantity } : storeItem),
            {
              headers: {
                Authorization: user.token,
              },
            }
          );
        });
      } else {
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
      }

      Notification.success({
        title: id ? "Dispositivo Actualizado" :"Nuevo Dispositivo Electrónico",
        description: id ? "Dispositivo actualizado con exito" :"Dispositivo Electrónico agregado con exito",
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
            errors={errors}
            register={register}
            control={control}
            stores={stores}
            marks={marks}
            types={types}
            token={user.token}
            storeData={[storeItemData, setStoreItemData]}
            deviceCharacteristics={[deviceCharacteristics, setDeviceCharacteristics]}
          />
          {errors.storeData && <FormErrorMessage message={errors.storeData.message} />}
          {errors.quantityValue && <FormErrorMessage message={errors.quantityValue.message} />}
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
