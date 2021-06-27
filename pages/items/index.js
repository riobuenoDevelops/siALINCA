import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlexboxGrid } from "rsuite";

import LoadingScreen from "../../components/layouts/LoadingScreen";
import SearchInput from "../../components/Search/SearchInput";
import ItemsTable from "../../components/tables/ItemsTable";

import { parseCookies } from "../../lib/parseCookies";
import { useItems } from "../../swr";

export default function ItemsPage({ handleLogged, handleUser, user }) {
  const { i18n } = useTranslation();
  const { items, isLoading, isError } = useItems(user.token);
  const [searchInputValue, handleSearchInputValue] = useState("");

  useEffect(() => {
    handleLogged(true);
    handleUser(user);
  }, []);

  if (isLoading) return <LoadingScreen />

  return (
    <FlexboxGrid>
      <FlexboxGrid.Item colspan={16} style={{ paddingBottom: "2em" }}>
        <h2 className="text-black text-bolder">
          Inventario ({i18n.t(`roles.${user?.user?.roleName}`)})
        </h2>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={8}>
        <SearchInput
          placehoderLabel="insumo"
          data={items}
          handleValue={handleSearchInputValue}
          value={searchInputValue}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24}>
        <ItemsTable items={items} searchInputValue={searchInputValue} />
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export async function getServerSideProps({ req }) {
  let user = {};
  const cookies = parseCookies(req);

  if (cookies && cookies.sialincaUser) {
    user = JSON.parse(cookies.sialincaUser);

    return {
      props: {
        user,
        isError: false,
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: "/login",
    },
    props: {},
  };
}