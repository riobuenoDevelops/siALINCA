import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button, FlexboxGrid } from "rsuite";

import "../../styles/forms.less";
import { parseCookies } from "../../lib/parseCookies";
import NewEnamelwareForm from "../../components/forms/NewEnamelwareForm";
import StoreService from "../../services/Store";
import MeasureService from "../../services/Measure";

export default function NewEnamelwarePage({
  handleLogged,
  handleUser,
  isError,
  user,
  stores,
  materials,
}) {
  const { handleSubmit, errors, control, register } = useForm();
  const [isLoading, handleLoading] = useState();

  useEffect(() => {
    if (isError) {
    }
    handleLogged(true);
    handleUser(user);
  });

  const onCancel = () => {};

  const onSubmit = async (data) => {};

  return (
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
          onClick={onCancel}
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
  );
}

export async function getServerSideProps({ req, params }) {
  let user = {},
    stores,
    measures;
  const cookies = parseCookies(req);

  if (cookies && cookies.sialincaUser) {
    try {
      user = JSON.parse(cookies.sialincaUser);

      stores = await StoreService.getStores({});
      stores = stores.map((store) => ({ ...store, _id: store._id.toString() }));

      measures = await MeasureService.getMeasures({
        name: "enamelwareMaterials",
      });

      return {
        props: {
          user,
          stores,
          materials: measures ? measures[0].measures : [],
          isError: false,
        },
      };
    } catch (err) {
      return {
        props: {
          user,
          stores,
          materials: measures ? measures[0].measures : [],
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
