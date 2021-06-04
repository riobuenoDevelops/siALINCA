import { useState, useEffect } from "react";
import { Button, FlexboxGrid, Modal } from "rsuite";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import NewMealForm from "../../components/forms/NewMealForm";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";

import { parseCookies } from "../../lib/parseCookies";
import StoreService from "../../services/Store";
import MeasureService from "../../services/Measure";

const NewMealPage = ({
  handleLogged,
  handleUser,
  user,
  isError,
  stores,
  mealPresentations,
  contentMeasures,
}) => {
  const router = useRouter();
  const { handleSubmit, errors, register, control } = useForm();
  const [isOpen, handleIsOpen] = useState(false);

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
    router.push("/items");
  };

  const onSubmit = (data) => {
    console.log(data);
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
            mealPresentations={mealPresentations}
            contentMeasures={contentMeasures}
            token={user.token}
          />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <FlexboxGrid>
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
            <FlexboxGrid.Item colspan={1} />
            <FlexboxGrid.Item colspan={3}>
              <Button
                block
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
          stores,
          mealPresentations: measures?.length ? measures[0] : null,
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

export default NewMealPage;
