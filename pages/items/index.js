import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FlexboxGrid } from "rsuite";
import FlexboxGridItem from "rsuite/lib/FlexboxGrid/FlexboxGridItem";
import SearchInput from "../../components/Search/SearchInput";
import { parseCookies } from "../../lib/parseCookies";
import { useTranslation } from "react-i18next";
import ItemsTable from "../../components/tables/ItemsTable";

import items from "../../public/staticData/medicineData.json";

const ItemsPage = ({ isLogged, handleLogged, handleUser, user, isError }) => {
  const history = useRouter();
  const { i18n } = useTranslation();
  const [searchInputValue, handleSearchInputValue] = useState("");

  useEffect(() => {
    if (isError) {
      history.push("/500");
    }
    handleLogged(true);
    handleUser(user);
  }, []);

  return (
    <FlexboxGrid>
      <FlexboxGridItem colspan={16} style={{ paddingBottom: "2em" }}>
        <h2 className="text-black text-bolder">
          Inventario ({i18n.t(`roles.${user?.user?.roleName}`)})
        </h2>
      </FlexboxGridItem>
      <FlexboxGridItem colspan={8}>
        <SearchInput
          placehoderLabel="insumo"
          data={[]}
          handleValue={handleSearchInputValue}
          value={searchInputValue}
        />
      </FlexboxGridItem>
      <FlexboxGridItem colspan={24}>
        <ItemsTable items={items} searchInputValue={searchInputValue} />
      </FlexboxGridItem>
    </FlexboxGrid>
  );
};

export async function getServerSideProps({ req, res }) {
  let user = {};
  const cookies = parseCookies(req);

  if (cookies && cookies.sialincaUser) {
    try {
      user = JSON.parse(cookies.sialincaUser);

      return {
        props: {
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

export default ItemsPage;
