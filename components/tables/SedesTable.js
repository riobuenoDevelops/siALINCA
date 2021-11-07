import React, { useState } from "react";
import {
  Table
} from "rsuite";
import { useRouter } from "next/router";
import Crc from "country-state-city";

import StatusCell from "./customCells/StatusCell";
import SedeActionCell from "./customCells/SedeActionCell";

import "../../styles/custom-theme.less";

const NameCell = ({ rowData, dataKey, ...props }) => {
  return (
    <Table.Cell {...props}>
      <span>{`${rowData.addressLine}, ${rowData.addressCity}, ${
        Crc.getStatesOfCountry(rowData.addressCountry).filter(
          (item) => item.isoCode === rowData.addressState
        )[0].name
      }, ${Crc.getCountryByCode(rowData.addressCountry).name}, ${
        rowData.addressZipcode
      }`}</span>
    </Table.Cell>
  );
};

const SedesTable = ({
  mutate,
  items,
  searchInputValue,
  handleSelectedSede,
  handleUpdateSede,
  handleSedeModalOpen,
}) => {
  let tableBody;
  const router = useRouter();
  const { Column, Cell, HeaderCell, Pagination } = Table;
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
        data={data.filter((item) =>
          !searchInputValue
            ? true
            : item.name.toLowerCase().includes(searchInputValue.toLowerCase())
        )}
        wordWrap
        autoHeight
        headerHeight={50}
        rowHeight={60}
        onRowClick={(row, event) => {
          if(!event.target.className.includes("rs-icon")){
            router.push(router.asPath + `/sedes/${row._id}`);
          }
        }}
        className="header-table shadow"
        bodyRef={(ref) => {
          tableBody = ref;
        }}
      >
        <Column
          verticalAlign="middle"
          width={250}
          style={{ paddingLeft: "1.5em" }}
        >
          <HeaderCell>
            <h6 className="text-black text-bold">Código</h6>
          </HeaderCell>
          <Cell dataKey="_id" />
        </Column>
        <Column verticalAlign="middle" width={170}>
          <HeaderCell>
            <h6 className="text-black text-bold">Nombre</h6>
          </HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column verticalAlign="middle" flexGrow={2}>
          <HeaderCell>
            <h6 className="text-black text-bold">Ubicación</h6>
          </HeaderCell>
          <NameCell />
        </Column>
        <Column verticalAlign="middle" flexGrow={1}>
          <HeaderCell>
            <h6 className="text-black text-bold">Estado</h6>
          </HeaderCell>
          <StatusCell />
        </Column>
        <Column
          verticalAlign="middle"
          align="right"
          style={{ paddingRight: "1.5em" }}
        >
          <HeaderCell>{""}</HeaderCell>
          <SedeActionCell
            mutate={mutate}
            tableRef={tableBody}
            handleSelectedSede={handleSelectedSede}
            handleUpdateSede={handleUpdateSede}
            handleModalOpen={handleSedeModalOpen}
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
export default SedesTable;
