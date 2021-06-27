import { useState, useEffect } from "react";
import {Button, FlexboxGrid, Notification} from "rsuite";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import NewMealForm from "../../components/forms/NewMealForm";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";

import { parseCookies } from "../../lib/parseCookies";
import StoreService from "../../services/Store";
import MeasureService from "../../services/Measure";
import AxiosService from "../../services/Axios";
import routes from "../../config/routes";
import FormErrorMessage from "../../components/common/FormErrorMessage";

export default function NewMealPage({
  handleLogged,
  handleUser,
  user,
  isError,
  stores,
  mealPresentations,
  contentMeasures,
}) {
  const history = useRouter();
  const { id, childId } = history.query;
  const { handleSubmit, errors, register, control, setError, clearErrors } = useForm();
  const [isOpen, handleIsOpen] = useState(false);
  const [storeItemData, setStoreItemData] = useState([]);
  const [isLoading, handleLoading] = useState(false);

  useEffect(() => {
    handleLogged(true);
    handleUser(user);
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

        await AxiosService.instance.post(
          routes.items + "/meals",
          { ...mealData, itemId: item.data },
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
        title: id? "Alimento Actualizado" :"Nuevo Alimento",
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

  return (
    <>
      <FlexboxGrid justify="start">
        <FlexboxGrid.Item colspan={24} style={{ marginBottom: "3em" }}>
          <h3 className="text-black text-bolder">Nuevo Alimento</h3>
          <span>Paso 1/1</span>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1em" }}>
          <NewMealForm
            register={register}
            errors={errors}
            control={control}
            stores={stores}
            storeItemData={[storeItemData,setStoreItemData]}
            mealPresentations={mealPresentations}
            contentMeasures={contentMeasures}
            token={user.token}
          />
          {errors.storeData && <FormErrorMessage message={errors.storeData.message} />}
          {errors.quantityValue && <FormErrorMessage message={errors.quantityValue.message} />}
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item colspan={17} />
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
};

export async function getServerSideProps({ req }) {
  let user = {},
    stores,
    measures,
    contentMeasures = [],
    mealPresentations = [];
  const cookies = parseCookies(req);

  if (cookies && cookies.sialincaUser) {
    try {
      user = JSON.parse(cookies.sialincaUser);

      stores = await StoreService.getStores({});
      stores = stores.map((store) => ({ ...store, _id: store._id.toString() }));

      measures = await MeasureService.getMeasures({});
      measures?.map((measureItem) => {
        if (measureItem.name === "mealPresentations") {
          mealPresentations = measureItem.measures;
        }
        if (
          measureItem.name === "gramo" ||
          measureItem.name === "litro" ||
          measureItem.name === "metro" ||
          measureItem.name === "superficie" ||
          measureItem.name === "volumen"
        ) {
          contentMeasures = [...contentMeasures, ...measureItem.measures];
        }
      });

      return {
        props: {
          user,
          stores,
          mealPresentations,
          contentMeasures,
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