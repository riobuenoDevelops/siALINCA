import { useState, useEffect } from "react";
import { Button, FlexboxGrid, Notification } from "rsuite";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import NewMealForm from "../../components/forms/NewMealForm";
import LoadingScreen from "../../components/layouts/LoadingScreen";
import FormErrorMessage from "../../components/common/FormErrorMessage";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";

import AxiosService from "../../services/Axios";
import routes from "../../config/routes";
import { useCurrentUser, useItem, useMeasures, useStores } from "../../hooks";

export default function NewMealPage({
  handleLogged,
  user
}) {
  const history = useRouter();
  const { id, childId } = history.query;
  const { handleSubmit, errors, register, control, setError, clearErrors } = useForm();
  const [isOpen, handleIsOpen] = useState(false);
  const [storeItemData, setStoreItemData] = useState([]);
  const [isLoading, handleLoading] = useState(false);
  const { isEmpty } = useCurrentUser();
  const { item, isLoading: itemLoading, itemStores } = useItem(user?.token, id);
  const { stores, isLoading: storesLoading } = useStores(user?.token);
  const { measures, isLoading: measuresLoading, mutate: measuresMutate } = useMeasures(user?.token);

  useEffect(() => {
    if (isEmpty) {
      history.push('/loading');
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
      }, 3000);
      return;
    }

    handleLoading(true);

    const itemData = {
      name: data.name,
      type: "meal",
      quantity: data.quantity,
      unitQuantity: data.unitQuantity,
      price: `${data.priceCurrency} ${data.price}`,
      userId: user.user._id,
      disabled: false
    };

    const mealData = {
      content: `${data.contentText} ${data.contentMeasure}`,
      presentation: data.presentation,
      expiratedDate: data.expiredDate,
    };

    try {
      if (id) {
        await AxiosService.instance.put(routes.items + "/" + id, itemData, {
          headers: {
            Authorization: user.token,
          },
        });

        await AxiosService.instance.put(
          routes.items + "/meals/" + childId,
          mealData,
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

        const mealId = await AxiosService.instance.post(
          routes.items + "/meals",
          { ...mealData, itemId: item.data },
          {
            headers: {
              Authorization: user.token,
            },
          }
        );

        await AxiosService.instance.put(`${routes.items}/${item.data}`, { itemChildId: mealId.data }, {
          headers: {
            Authorization: user.token,
          },
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
        title: id ? "Alimento Actualizado" : "Nuevo Alimento",
        description: id ? "Alimento actualizado con exito" : "Alimento agregado con exito",
        placement: "bottomStart",
        duration: 9000,
      });
      handleLoading(false);
      history.push("/items");
    } catch (err) {
      Notification.error({
        title: "Error",
        description: err.response.data,
        placement: "bottomStart",
        duration: 9000,
      });
      console.error(err.response.data);
      handleLoading(false);
    }
  };

  if (storesLoading || measuresLoading || (id && itemLoading)) return <LoadingScreen />

  return (
    <>
      <FlexboxGrid justify="start" style={{ marginBottom: '3rem' }}>
        <FlexboxGrid.Item colspan={24} style={{ marginBottom: "3em" }}>
          <h3 className="text-bolder">{id ? "Actualizar Alimento" : "Nuevo Alimento"}</h3>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1em" }}>
          <NewMealForm
            item={item}
            itemStores={itemStores}
            mutate={measuresMutate}
            register={register}
            errors={errors}
            control={control}
            storeItemData={[storeItemData, setStoreItemData]}
            token={user.token}
            stores={stores.filter(store => !store.disabled)}
            mealPresentations={measures.flatMap(measure => {
              if (measure.name === "mealPresentations") {
                return measure.measures;
              }
              return [];
            })}
            contentMeasures={measures.flatMap(measureItem => {
              if (measureItem.name === "gramo" ||
                measureItem.name === "litro" ||
                measureItem.name === "metro" ||
                measureItem.name === "superficie" ||
                measureItem.name === "volumen") {
                return measureItem.measures;
              }
              return [];
            })}
          />
          {errors.storeData && <FormErrorMessage message={errors.storeData.message}/>}
          {errors.quantityValue && <FormErrorMessage message={errors.quantityValue.message}/>}
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item colspan={17}/>
            <FlexboxGrid.Item colspan={3}>
              <Button
                block
                appearance="default"
                className="button text-black text-medium bg-color-white shadow"
                onClick={onOpen}
              >
                Cancelar
              </Button>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={3}>
              <Button
                block
                loading={isLoading}
                appearance="primary"
                className="button text-white text-medium bg-color-primary shadow"
                onClick={handleSubmit(onSubmit)}
              >
                Finalizar
              </Button>
            </FlexboxGrid.Item>
          </FlexboxGrid>
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
