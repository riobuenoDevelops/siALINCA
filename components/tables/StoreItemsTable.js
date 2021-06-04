import { useState } from "react";
import { useRouter } from "next/router";
import { Table } from "rsuite";
import StoreActionCell from "./customCells/StoreActionCell";

const StoreItemsTable = ({
                           items,
                           handleSelectedStore,
                           handleUpdateStore,
                         }) => {
  let tableBody;
  const router = useRouter();
  const {Column, Cell, HeaderCell, Pagination} = Table;
  const [page, handlePage] = useState(1);
  const [displayLength, handleDisplayLength] = useState(10);
  
  const handleChangePage = (dataKey) => {
    handlePage(dataKey);
  };
  
  const handleChangeLength = (dataKey) => {
    handleDisplayLength(dataKey);
    handlePage(1);
  };
  
  const getData = () => {
    const data = items.filter((v, i) => {
      const start = displayLength * (page - 1);
      const end = start + displayLength;
      return i >= start && i < end;
    });
    
    return data;
  };
  
  const data = getData();
  
  return (
    <>
      <Table
        data={data}
        wordWrap
        autoHeight
        headerHeight={50}
        rowHeight={60}
        className="header-table"
        bodyRef={(ref) => {
          tableBody = ref;
        }}
      >
        <Column
          width={250}
          verticalAlign="middle"
          style={{paddingLeft: "1.5em"}}
        >
          <HeaderCell
            className="header-table-primary">
            <h6 className="text-black text-bold">Código</h6>
          </HeaderCell>
          <Cell dataKey="_id"/>
        </Column>
        <Column verticalAlign="middle" flexGrow={1}>
          <HeaderCell className="header-table-primary">
            <h6 className="text-black text-bold">Nombre</h6>
          </HeaderCell>
          <Cell dataKey="name"/>
        </Column>
        <Column verticalAlign="middle" flexGrow={1}>
          <HeaderCell className="header-table-primary">
            <h6 className="text-black text-bold">Tipo</h6>
          </HeaderCell>
          <Cell dataKey="type"/>
        </Column>
        <Column verticalAlign="middle" flexGrow={1}>
          <HeaderCell className="header-table-primary">
            <h6 className="text-black text-bold">Cantidad</h6>
          </HeaderCell>
          <Cell dataKey="quantity"/>
        </Column>
        <Column
          verticalAlign="middle"
          width={60}
          align="end"
          style={{paddingRight: "1.5em"}}
        >
          <HeaderCell className="header-table-primary">{""}</HeaderCell>
          <StoreActionCell
            tableRef={tableBody}
            handleSelectedStore={handleSelectedStore}
            handleUpdateStore={handleUpdateStore}
          />
        </Column>
      </Table>
      <Pagination
        lengthMenu={[
          {
            value: 10,
            label: 10,
          },
          {
            value: 20,
            label: 20,
          },
          
          {
            value: 50,
            label: 50,
          },
        ]}
        activePage={page}
        displayLength={displayLength}
        total={items.length}
        onChangePage={handleChangePage}
        onChangeLength={handleChangeLength}
      />
    </>
  );
};

export default StoreItemsTable;