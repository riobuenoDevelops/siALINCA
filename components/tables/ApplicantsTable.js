import React, { useState } from "react";
import { Table } from "rsuite";

import "../../styles/custom-theme.less";
import ApplicantActionCell from "./customCells/ApplicantActionCell";
import StatusCell from "./customCells/StatusCell";

const NameCell = ({ rowData, rowKey, ...props }) => {
  return (
    <Table.Cell {...props}>
      <span>{`${rowData.names} ${rowData.lastNames}`}</span>
    </Table.Cell>
  );
};

const ApplicantsTable = ({
  mutate,
  items,
  handleItems,
  searchInputValue,
  handleSelectedApplicant,
  handleUpdateApplicant,
  handleApplicantModalOpen,
}) => {
  let tableBody;
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
            : item.names
                .toLowerCase()
                .includes(searchInputValue.toLowerCase()) ||
              item.lastNames
                .toLowerCase()
                .includes(searchInputValue.toLowerCase()) ||
              item.cedula
                .toLowerCase()
                .includes(searchInputValue.toLowerCase()) ||
              item.phone.toLowerCase().includes(searchInputValue.toLowerCase())
        )}
        wordWrap
        autoHeight
        headerHeight={50}
        rowHeight={60}
        className="header-table shadow"
        bodyRef={(ref) => {
          tableBody = ref;
        }}
      >
        <Column
          verticalAlign="middle"
          width={250}
        >
          <HeaderCell>
            <h6 className="text-black text-bold">Código</h6>
          </HeaderCell>
          <Cell dataKey="_id" />
        </Column>
        <Column verticalAlign="middle" flexGrow={2}>
          <HeaderCell>
            <h6 className="text-black text-bold">Nombre y Apellido</h6>
          </HeaderCell>
          <NameCell />
        </Column>
        <Column verticalAlign="middle" flexGrow={1}>
          <HeaderCell>
            <h6 className="text-black text-bold">Cédula</h6>
          </HeaderCell>
          <Cell dataKey="cedula" />
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
          width={60}
        >
          <HeaderCell>{""}</HeaderCell>
          <ApplicantActionCell
            mutate={mutate}
            tableRef={tableBody}
            handleSelectedApplicant={handleSelectedApplicant}
            handleUpdateApplicant={handleUpdateApplicant}
            handleApplicantModalOpen={handleApplicantModalOpen}
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
export default ApplicantsTable;
