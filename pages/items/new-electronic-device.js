import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button, FlexboxGrid, Notification } from "rsuite";

import LoadingScreen from "../../components/layouts/LoadingScreen";
import NewElectronicDeviceForm from "../../components/forms/NewElectronicDeviceForm";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";
import FormErrorMessage from "../../components/common/FormErrorMessage";

import { useCurrentUser, useItem, useMeasures, useStores } from "../../hooks";
import AxiosService from "../../services/Axios";
import routes from "../../config/routes";

import "../../styles/forms.less";

export default function NewElectronicDevicePage({
  handleLogged,
  user
}) {
  const history = useRouter();
  const { id, childId } = history.query;
  const { handleSubmit, errors, register, control, setError, clearErrors } = useForm();
  const [isLoading, handleLoading] = useState();
  const [isOpen, handleIsOpen] = useState(false);
  const [storeItemData, setStoreItemData] = useState([]);
  const [deviceCharacteristics, setDeviceCharacteristics] = useState([]);
  const { isEmpty } = useCurrentUser();
  const { item, isLoading: itemLoading, itemStores } = useItem(user?.token, id);
  const { stores, isLoading: storesLoading } = useStores(user?.token);
  const { measures, isLoading: measuresLoading, mutate: measuresMutate } = useMeasures(user?.token);



  useEffect(() => {
    if (isEmpty) {
      history.push('/login');
    }

    handleLogged(true);
  }, []);

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
    if (!deviceCharacteristics.length) {
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

    if (!storeItemData.length) {
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

    if (quantityCheck.quantity !== data.quantity) {
      setError("quantityValue", {
        message: "La suma de todos los almacenes agregados debe ser igual al valor en el campo 'Cantidad'"
      })
      setTimeout(() => {
        clearErrors("quantityValue")
      }, 3500);
      return;
    }

    handleLoading(true);

    const itemData = {
      name: data.name,
      type: "electroDevice",
      quantity: data.quantity,
      unitQuantity: data.unitQuantity,
      price: `${data.priceCurrency} ${data.priceText}`,
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
      if (id) {
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

        const electroId = await AxiosService.instance.post(
          routes.items + "/electro-devices",
          { ...electroDeviceData, itemId: item.data },
          {
            headers: {
              Authorization: user.token,
            },
          }
        );

        await AxiosService.instance.put(`${routes.items}/${item.data}`,
          { itemChildId: electroId.data }, {
            headers: {
              Authorization: user.token
            }
          });

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
        title: id ? "Dispositivo Actualizado" : "Nuevo Dispositivo Electrónico",
        description: id ? "Dispositivo actualizado con exito" : "Dispositivo Electrónico agregado con exito",
        placement: "bottomStart",
        duration: 9000,
      });
      handleLoading(false);
      history.push("/items");
    } catch (err) {
      Notification.error({
        title: "Error",
        placement: "bottomStart",
        duration: 9000,
      });
      handleLoading(false);
    }
  };

  if (storesLoading || measuresLoading || (id && itemLoading)) return <LoadingScreen />
  console.log(id, childId);

  return (
    <>
      <FlexboxGrid justify="space-between">
        <FlexboxGrid.Item colspan={24} style={{ marginBottom: "2em" }}>
          <h3 className="text-bolder">Nuevo Dispositivo Electrónico</h3>
          <span>Paso 1/1</span>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <NewElectronicDeviceForm
            item={item}
            itemStores={itemStores}
            mutate={measuresMutate}
            errors={errors}
            register={register}
            control={control}
            token={user.token}
            storeData={[storeItemData, setStoreItemData]}
            deviceCharacteristics={[deviceCharacteristics, setDeviceCharacteristics]}
            stores={stores.filter(store => !store.disabled)}
            marks={measures.flatMap(measure => {
              if (measure.name === "electroDeviceMarks") {
                return measure.measures;
              }
              return [];
            })}
            types={measures.flatMap(measure => {
              if (measure.name === "electroDeviceTypes") {
                return measure.measures;
              }
              return [];
            })}
          />
          {errors.storeData && <FormErrorMessage message={errors.storeData.message}/>}
          {errors.quantityValue && <FormErrorMessage message={errors.quantityValue.message}/>}
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