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

import "../../styles/forms.less";

const NewMedicinePage = ({
  handleLogged,
  handleUser,
  user,
  stores,
  contentMeasures,
  markLabs,
  presentations,
  isError,
}) => {
  const history = useRouter();
  const { handleSubmit, errors, register, control } = useForm({
    mode: "onBlur",
  });
  const [isOpen, handleOpen] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const [isLoading, handleLoading] = useState(false);
  const [quantityValue, setQuantity] = useState("");
  const [storeItemData, setStoreItemData] = useState([]);

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
      quantity: quantityValue,
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
      <FlexboxGrid className="form" justify="space-between">
        <FlexboxGrid.Item colspan={24} style={{ marginBottom: "3em" }}>
          <h3>Nuevo Medicamento</h3>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <NewMedicineForm
            errors={errors}
            register={register}
            control={control}
            stores={stores}
            storeData={[storeItemData, setStoreItemData]}
            quantityData={[quantityValue, setQuantity]}
            markLabs={markLabs}
            contentMeasures={contentMeasures}
            presentations={presentations}
            token={user.token}
          />
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
};

export async function getServerSideProps({ req, res }) {
  let user = null,
    stores,
    measures,
    contentMeasures = [],
    presentations = [],
    markLabs = [];

  const cookies = parseCookies(req);

  if (cookies && cookies.sialincaUser) {
    try {
      user = JSON.parse(cookies.sialincaUser);

      stores = await StoreService.getStores({ disabled: false });
      stores = stores.map((store) => ({ ...store, _id: store._id.toString() }));

      measures = await MeasureService.getMeasures({});

      measures.map((measureItem) => {
        if (
          measureItem.name === "gramo" ||
          measureItem.name === "litro" ||
          measureItem.name === "metro" ||
          measureItem.name === "superficie" ||
          measureItem.name === "volumen"
        ) {
          contentMeasures = measureItem.measures;
        }
        if (measureItem.name === "medicineMarkLabs") {
          markLabs = measureItem.measures;
        }
        if (measureItem.name === "medicinePresentation") {
          presentations = measureItem.measures;
        }
      });

      return {
        props: {
          stores,
          markLabs,
          contentMeasures,
          presentations,
          user,
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

export default NewMedicinePage;
