import { Button, FlexboxGrid, Notification } from "rsuite";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import NewMedicineForm from "../../components/forms/NewMedicineForm";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";
import FormErrorMessage from "../../components/common/FormErrorMessage";
import LoadingScreen from "../../components/layouts/LoadingScreen";

import {useItem, useStores, useCurrentUser, useMeasures} from "../../hooks";

import AxiosService from "../../services/Axios";
import routes from "../../config/routes";

import "../../styles/forms.less";

export default function NewMedicinePage({
  user,
  handleLogged
}) {
  const history = useRouter();
  const { id, childId } = history.query;
  const { handleSubmit, errors, register, control, setError, clearErrors } = useForm({
    mode: "onBlur",
  });
  const [isOpen, handleOpen] = useState(false);
  const [isLoading, handleLoading] = useState(false);
  const [storeItemData, setStoreItemData] = useState([]);
  const { isEmpty } = useCurrentUser();
  const { item, isLoading: itemLoading, itemStores } = useItem(user?.token, id);
  const { stores, isLoading: storesLoading } = useStores(user?.token);
  const { measures, isLoading: measuresLoading, mutate: measuresMutate } = useMeasures(user?.token);

  useEffect(() => {
    if (isEmpty) {
      history.push("/login");
    }

    handleLogged(true);
  }, []);

  const onSubmit = async (data) => {
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
      type: "medicine",
      quantity: data.quantity,
      unitQuantity: data.quantityUnit,
      price: `${data.priceCurrency} ${data.priceText}`,
      userId: user.user._id,
    };
    const medicineData = {
      description: data.description,
      content: `${data.contentText} ${data.contentMeasure}`,
      markLab: data.markLab,
      presentation: data.presentation,
      expiratedDate: data.expiredDate,
    };

    try {
      if(id) {
        await AxiosService.instance.put(`${routes.items}/${id}?email=${user?.user.email}`, itemData, {
          headers: {
            Authorization: user.token,
          },
        });

        await AxiosService.instance.put(
          `${routes.items}/medicines/${childId}`,
          medicineData,
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
            storeItems.map(storeItem => storeItem.itemId === id ? { itemId: id, quantity: store.quantity } : storeItem),
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

        const medicineId = await AxiosService.instance.post(
          routes.items + "/medicines",
          { ...medicineData, itemId: item.data },
          {
            headers: {
              Authorization: user.token,
            },
          }
        );

        await AxiosService.instance.put(
            `${routes.items}/${item.data}`,
            { itemChildId: medicineId.data },
            {
              headers: {
                Authorization: user.token
              }
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
        title: id ? "Medicamento Actualizado" :"Nuevo Medicamento",
        description: id ? "Medicamento actualizado con exito" : "Medicamento agregado con exito",
        placement: "bottomStart",
        duration: 9000,
      });
      handleLoading(false);
      history.push("/items");
    } catch (err) {
      Notification.error({
        title: "Error",
        description: "Ha ocurrido un error",
        placement: "bottomStart",
        duration: 9000,
      });
      console.error(err);
      handleLoading(false);
    }
  };

  const onHide = () => {
    handleOpen(false);
  };

  const onCancel = () => {
    handleOpen(true);
  };

  const onHandleCloseConfirmationModal = () => {
    history.push("/items");
  };

  if(storesLoading || measuresLoading || (id && itemLoading)) return <LoadingScreen />;

  return (
    <>
      <FlexboxGrid className="form" justify="space-between">
        <FlexboxGrid.Item colspan={24} style={{ marginBottom: "3em" }}>
          <h3 className="text-bolder">{id ? "Actualizar Medicamento" : "Nuevo Medicamento"}</h3>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <NewMedicineForm
            item={item}
            itemStores={itemStores}
            measuresMutate={measuresMutate}
            errors={errors}
            register={register}
            control={control}
            stores={stores.filter(store => !store.disabled)}
            storeData={[storeItemData, setStoreItemData]}
            token={user.token}
            markLabs={measures.flatMap(measureItem => {
              if (measureItem.name === "medicineMarkLabs"){
                return measureItem.measures;
              }
              return [];
            })}
            contentMeasures={measures.flatMap(measureItem => {
              if (measureItem.name === "gramo" ||
                measureItem.name === "litro" ||
                measureItem.name === "metro" ||
                measureItem.name === "superficie" ||
                measureItem.name === "volumen"){
                return measureItem.measures;
              }
              return [];
            })}
            presentations={measures.flatMap(measureItem => {
              if (measureItem.name === "medicinePresentation"){
                return measureItem.measures;
              }
              return [];
            })}
          />
          {errors.storeData && <FormErrorMessage message={errors.storeData.message} />}
          {errors.quantityValue && <FormErrorMessage message={errors.quantityValue.message} />}
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={13} />
        <FlexboxGrid.Item colspan={4} className="form-buttons-container">
          <Button
            block
            appearance="default"
            className="button shadow bg-color-white text-medium text-black"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={4} className="form-buttons-container">
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
        handleOpen={handleOpen}
        onHandleCloseConfirmationModal={onHandleCloseConfirmationModal}
        onHide={onHide}
      />
    </>
  );
}
