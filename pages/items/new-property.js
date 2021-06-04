import { useState, useEffect } from "react";
import { Button, FlexboxGrid } from "rsuite";
import { useForm } from "react-hook-form";

import { parseCookies } from "../../lib/parseCookies";
import StoreService from "../../services/Store";

import "../../styles/forms.less";

export default function NewPropertyPage({
  handleLogged,
  handleUser,
  isError,
  user,
  stores,
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
    <FlexboxGrid justify="space-between">
      <FlexboxGrid.Item colspan={24}>
        <h3 className="text-bolder">Nuevo Inmueble</h3>
        <span>Paso 1/1</span>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24}>
        <NewPropertyForm
          errors={errors}
          register={register}
          control={control}
          stores={stores}
          token={token}
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
    stores;
  const cookies = parseCookies(req);

  if (cookies && cookies.sialincaUser) {
    try {
      user = JSON.parse(cookies.sialincaUser);

      stores = await StoreService.getStores({});
      stores = stores.map((store) => ({ ...store, _id: store._id.toString() }));

      return {
        props: {
          user,
          stores,
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
