import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {Button, FlexboxGrid, Notification} from "rsuite";

import NewEnamelwareForm from "../../components/forms/NewEnamelwareForm";

import { parseCookies } from "../../lib/parseCookies";
import MeasureService from "../../services/Measure";

import "../../styles/forms.less";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";
import {useRouter} from "next/router";
import AxiosService from "../../services/Axios";
import routes from "../../config/routes";
import {useStores} from "../../hooks";

export default function NewEnamelwarePage({
  handleLogged,
  handleUser,
  isError,
  user,
  materials,
  sizes
}) {
  const history = useRouter();
  const { id, childId } = history.query;
  const { handleSubmit, errors, register, control, setError, clearErrors } = useForm();
  const { stores, isLoading: storesLoading } = useStores(user.token);
  const [isOpen, handleIsOpen] = useState(false);
  const [isLoading, handleLoading] = useState(false);
  const [storeItemData, setStoreItemData] = useState([]);

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
      if (id) {
        await AxiosService.instance.put(routes.items + "/" + id, itemData, {
          headers: {
            Authorization: user.token,
          },
        });

        await AxiosService.instance.put(
          routes.items + "/enamelware/" + childId,
          enamelwareData,
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
      }

      Notification.success({
        title: id ? "Utencilio Actualizado" :"Nuevo Utencilio",
        description: id ? "Utencilio actualizado con exito" :"Utencilio agregado con exito",
        placement: "bottomStart",
        duration: 9000,
      });
      handleLoading(false);
      history.push("/items");
    } catch (err) {
      Notification.error({
        title: "Error",
        description: err.message,
        placement: "bottomStart",
        duration: 9000,
      });
      console.error(err);
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
    measures = [], sizes = [], materials = [];
  const cookies = parseCookies(req);

  if (cookies && cookies.sialincaUser) {
    try {
      user = JSON.parse(cookies.sialincaUser);

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
          materials,
          sizes,
          isError: false,
        },
      };
    } catch (err) {
      return {
        props: {
          user,
          materials,
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
