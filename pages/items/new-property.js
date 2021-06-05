import { useState, useEffect } from "react";
import { Button, FlexboxGrid } from "rsuite";
import { useForm } from "react-hook-form";

import NewPropertyForm from "../../components/forms/NewPropertyForm";
import { parseCookies } from "../../lib/parseCookies";
import StoreService from "../../services/Store";

import "../../styles/forms.less";
import MeasureService from "../../services/Measure";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";
import { useRouter } from "next/router";

export default function NewPropertyPage({
  handleLogged,
  handleUser,
  isError,
  user,
  stores,
  marks,
  materials,
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
          <h3 className="text-bolder">Nuevo Inmueble</h3>
          <span>Paso 1/1</span>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <NewPropertyForm
            errors={errors}
            register={register}
            control={control}
            stores={stores}
            marks={marks}
            materials={materials}
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
    materials = [];
  const cookies = parseCookies(req);

  if (cookies && cookies.sialincaUser) {
    try {
      user = JSON.parse(cookies.sialincaUser);

      stores = await StoreService.getStores({});
      stores = stores.map((store) => ({ ...store, _id: store._id.toString() }));

      measures = await MeasureService.getMeasures({});
      measures.map((measure) => {
        if (measure.name === "propertyMarks") {
          marks = measure.measures;
        }
        if (measure.name === "propertyMaterials") {
          materials = measure.measures;
        }
      });

      return {
        props: {
          user,
          stores,
          marks,
          materials,
          isError: false,
        },
      };
    } catch (err) {
      return {
        props: {
          user,
          stores,
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
