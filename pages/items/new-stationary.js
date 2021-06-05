import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, FlexboxGrid } from "rsuite";
import { useForm } from "react-hook-form";

import NewStationaryForm from "../../components/forms/NewStationaryForm";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";

import { parseCookies } from "../../lib/parseCookies";
import StoreService from "../../services/Store";
import MeasureService from "../../services/Measure";

import "../../styles/forms.less";

export default function NewStationaryPage({
  handleLogged,
  handleUser,
  isError,
  user,
  stores,
  marks,
  presentations,
}) {
  const router = useRouter();
  const { handleSubmit, errors, control, register } = useForm();
  const [isLoading, handleLoading] = useState();
  const [isOpen, handleIsOpen] = useState(false);

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
    router.push("/items");
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <FlexboxGrid justify="space-between">
        <FlexboxGrid.Item colspan={24} style={{ marginBottom: "2em" }}>
          <h3 className="text-bolder">Nueva Papeleria</h3>
          <span>Paso 1/1</span>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <NewStationaryForm
            errors={errors}
            register={register}
            control={control}
            stores={stores}
            marks={marks}
            presentations={presentations}
            token={user.token}
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
    stores,
    measures,
    marks = [],
    presentations = [];
  const cookies = parseCookies(req);

  if (cookies && cookies.sialincaUser) {
    try {
      user = JSON.parse(cookies.sialincaUser);

      stores = await StoreService.getStores({});
      stores = stores.map((store) => ({ ...store, _id: store._id.toString() }));

      measures = await MeasureService.getMeasures({});
      measures.map((measure) => {
        if (measure.name === "stationaryMarks") {
          marks = measure.measures;
        }
        if (measure.name === "stationaryPresentations") {
          presentations = measure.measures;
        }
      });

      return {
        props: {
          user,
          stores,
          marks,
          presentations,
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
