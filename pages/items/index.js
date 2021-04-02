import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { FlexboxGrid } from "rsuite";
import FlexboxGridItem from "rsuite/lib/FlexboxGrid/FlexboxGridItem";
import CustomTable from "../../components/customComponents/CustomTable";
import SearchInput from "../../components/Search/SearchInput";

const ItemsPage = ({ isLogged, handleLogged }) => {
  const history = useRouter();

  const items = [];

  useEffect(() => {
    if (
      localStorage.getItem("logged") !== null &&
      localStorage.getItem("logged") === "false" &&
      !isLogged
    ) {
      handleLogged(false);
      history.push("/login");
    }
  }, []);

  return (
    <FlexboxGrid>
      <FlexboxGridItem colspan={16} style={{ paddingBottom: "2em" }}>
        <h2 className="text-black text-bolder">Inventario (Admin)</h2>
      </FlexboxGridItem>
      <FlexboxGridItem colspan={8}>
        <SearchInput placehoderLabel="insumo" />
      </FlexboxGridItem>
      <FlexboxGridItem colspan={24}>
        <CustomTable
          items={items}
          columns={["id", "name", "category", "price", "quantity"]}
          colAlign={["center", "start", "start", "start", "start"]}
          columnType={["string", "string", "string", "symbol", "string"]}
          colFlexGrow={[0, 2, 1, 1, 1]}
        />
      </FlexboxGridItem>
    </FlexboxGrid>
  );
};

export default ItemsPage;
