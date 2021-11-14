import { useState, useEffect } from "react";
import { Button, FlexboxGrid, Notification } from "rsuite";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import LoadingScreen from "../../components/layouts/LoadingScreen";
import NewPropertyForm from "../../components/forms/NewPropertyForm";
import FormErrorMessage from "../../components/common/FormErrorMessage";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";

import { useCurrentUser, useItem, useMeasures, useStores } from "../../hooks";
import AxiosService from "../../services/Axios";
import routes from "../../config/routes";

import "../../styles/forms.less";

export default function NewPropertyPage({
  handleLogged,
  user
}) {
  const history = useRouter();
  const { id, childId } = history.query;
  const { handleSubmit, errors, register, control, setError, clearErrors } = useForm();
  const [isLoading, handleLoading] = useState();
  const [isOpen, handleIsOpen] = useState(false);
  const [storeItemData, setStoreItemData] = useState([]);
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
      type: "property",
      quantity: data.quantity,
      unitQuantity: data.unitQuantity,
      price: `${data.priceCurrency} ${data.priceText}`,
      userId: user.user._id,
      disabled: false
    };
    const propertyData = {
      isRealState: data.isRealState,
      description: data.description,
      serial: data.serial,
      model: data.model,
      mark: data.mark,
      material: data.material,
      addressLine: data.addressLine,
      addressCountry: data.addressCountry,
      addressCity: data.addressCity,
      addressState: data.addressState,
      addressZipcode: data.addressZipcode,
    };

    try {
      if (id) {
        await AxiosService.instance.put(routes.items + "/" + id, itemData, {
          headers: {
            Authorization: user.token,
          },
        });

        await AxiosService.instance.put(
          routes.items + "/properties/" + childId,
          propertyData,
          {
            headers: {
              Authorization: user.token
            },
          }
        );

        storeItemData.map(async (store) => {
          const storeItems = stores.filter(myStore => myStore.id === store.storeId)[0].items;
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
      }

      Notification.success({
        title: id ? "Inmueble Actualizado" : "Nueva Inmueble",
        description: id ? "Inmueble actualizado con exito" : "Inmueble agregado con exito",
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

  if (storesLoading || measuresLoading || (id && itemLoading)) return <LoadingScreen />

  return (
    <>
      <FlexboxGrid justify="space-between">
        <FlexboxGrid.Item colspan={24} style={{ marginBottom: "2em" }}>
          <h3 className="text-bolder">{`${id ? "Actualizar Inmueble" : "Nuevo Inmueble"}`}</h3>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <NewPropertyForm
            item={item}
            itemStores={itemStores}
            mutate={measuresMutate}
            errors={errors}
            register={register}
            control={control}
            storeData={[storeItemData, setStoreItemData]}
            token={user.token}
            stores={stores.filter(store => !store.disabled)}
            marks={measures.flatMap(measure => {
              if (measure.name === "propertyMarks") {
                return measure.measures;
              }

              return [];
            })}
            materials={measures.flatMap(measure => {
              if (measure.name === "propertyMaterials") {
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
