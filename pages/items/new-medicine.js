import { Button, FlexboxGrid, Modal, Notification } from "rsuite";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "../../lib/parseCookies";
import AxiosService from "../../services/Axios";
import StoreService from "../../services/Store";
import MeasureService from "../../services/Measure";
import routes from "../../config/routes";

import NewMedicineForm from "../../components/forms/NewMedicineForm";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";

const NewMedicinePage = ({
  handleLogged,
  handleUser,
  user,
  stores,
  contentMeasures,
  markLabsList,
  presentationList,
  isError,
}) => {
  const history = useRouter();
  const { handleSubmit, errors, register, control } = useForm({
    mode: "onBlur",
    defaultValues: {
      disabled: false,
    },
  });
  const [isOpen, handleOpen] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const [isLoading, handleLoading] = useState(false);

  useEffect(() => {
    if (isError) {
      history.push("/500");
    }
    handleLogged(true);
    handleUser(user);
  }, []);

  const onSubmit = async (data) => {
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
      const item = await AxiosService.instance.post(routes.items, itemData, {
        headers: {
          Authorization: user.token,
        },
      });

      await AxiosService.instance.post(
        routes.items + "/medicines",
        { ...medicineData, itemId: item.data },
        {
          headers: {
            Authorization: user.token,
          },
        }
      );

      storeData.map(async (store) => {
        await AxiosService.instance.post(
          routes.getStores + `/${store.storeId}/items`,
          [{ itemId: item.data, quantity: parseInt(store.quantity) }],
          {
            headers: {
              Authorization: user.token,
            },
          }
        );
      });

      Notification.success({
        title: "Nuevo Medicamento",
        description: "Medicamento agregado con exito",
        placement: "bottomStart",
        duration: 9000,
      });
      handleLoading(false);
      history.push("/items");
    } catch (err) {
      console.error(err.response.data.message);
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

  return (
    <>
      <FlexboxGrid justify="start">
        <FlexboxGrid.Item colspan={24} style={{ marginBottom: "3em" }}>
          <h3>Nuevo Medicamento</h3>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <NewMedicineForm
            errors={errors}
            register={register}
            control={control}
            stores={stores}
            storeItemData={storeData}
            setStoreItemData={setStoreData}
            markLabsData={markLabsList}
            contentMeasureData={contentMeasures}
            presentationData={presentationList}
            token={user.token}
          />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1rem" }}>
          <FlexboxGrid>
            <FlexboxGrid.Item colspan={15} />
            <FlexboxGrid.Item colspan={4}>
              <Button
                block
                appearance="default"
                className="button shadow bg-color-white text-medium text-black"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={1} />
            <FlexboxGrid.Item colspan={4}>
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
};

export async function getServerSideProps({ req, res }) {
  let user = null,
    stores,
    measures,
    contentMeasures,
    presentationList,
    markLabsList;

  const cookies = parseCookies(req);

  if (cookies && cookies.sialincaUser) {
    try {
      user = JSON.parse(cookies.sialincaUser);

      stores = await StoreService.getStores({ disabled: false });
      stores = stores.map((store) => ({ ...store, _id: store._id.toString() }));

      measures = await MeasureService.getMeasures({});

      contentMeasures = measures
        .map((measureItem) => {
          if (
            measureItem.name === "gramo" ||
            measureItem.name === "litro" ||
            measureItem.name === "metro" ||
            measureItem.name === "superficie" ||
            measureItem.name === "volumen"
          ) {
            return measureItem.measures;
          }
        })
        .flat()
        .filter((item) => item !== undefined);

      presentationList = measures
        .map((measureitem) => {
          if (measureitem.name === "medicinePresentation") {
            return measureitem.measures;
          }
        })
        .flat()
        .filter((item) => item !== undefined);

      markLabsList = measures
        .map((measureitem) => {
          if (measureitem.name === "markLabs") {
            return measureitem.measures;
          }
        })
        .flat()
        .filter((item) => item !== undefined);

      return {
        props: {
          stores: stores || [],
          markLabsList: markLabsList || [],
          contentMeasures: contentMeasures || [],
          presentationList: presentationList || [],
          user,
          isError: false,
        },
      };
    } catch (err) {
      return {
        props: {
          user,
          stores: stores?.data || [],
          markLabsList: markLabsList || [],
          contentMeasures: contentMeasures || [],
          presentationList: presentationList || [],
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

export default NewMedicinePage;
