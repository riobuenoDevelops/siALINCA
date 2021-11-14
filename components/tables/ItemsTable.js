import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router"
import {
  Table
} from "rsuite";

import StatusCell from "./customCells/StatusCell";
import ItemActionCell from "./customCells/ItemActionCell";

import "../../styles/custom-theme.less";

const TypeCell = ({ rowData, rowKey, dataKey, ...props }) => {
  const { t } = useTranslation();

  return (
    <Table.Cell {...props}>
      <span>{t(`categories.${rowData[dataKey]}`)}</span>
    </Table.Cell>
  )
}

export default function ItemsTable({ items, searchInputValue, mutate, role }) {

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
        className="header-table shadow"
        bodyRef={(ref) => {
          tableBody = ref;
        }}
        onRowClick={(row, event) => {
          if (event.target.className === "rs-table-cell-wrap") {
            router.push(router.asPath + `/${row._id}`);
          }
        }}
      >
        <Column
          verticalAlign="middle"
          flexGrow={2}
        >
          <HeaderCell>
            <h6 className="text-black text-bold">Código</h6>
          </HeaderCell>
          <Cell dataKey="_id" />
        </Column>
        <Column verticalAlign="middle" flexGrow={2}>
          <HeaderCell>
            <h6 className="text-black text-bold">Nombre</h6>
          </HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column verticalAlign="middle" flexGrow={1}>
          <HeaderCell>
            <h6 className="text-black text-bold">Categoría</h6>
          </HeaderCell>
          <TypeCell dataKey="type" />
        </Column>
        <Column verticalAlign="middle" flexGrow={1}>
          <HeaderCell>
            <h6 className="text-black text-bold">Cantidad</h6>
          </HeaderCell>
          <Cell dataKey="quantity" />
        </Column>
        <Column verticalAlign="middle" flexGrow={1}>
          <HeaderCell>
            <h6 className="text-black text-bold">Precio</h6>
          </HeaderCell>
          <Cell dataKey="price" />
        </Column>
        {role !== "guest" &&
          <Column verticalAlign="middle" flexGrow={1}>
            <HeaderCell>
              <h6 className="text-black text-bold">Status</h6>
            </HeaderCell>
            <StatusCell/>
          </Column>
        }
        {role !== "guest" &&
          <Column
            verticalAlign="middle"
            flexGrow={1}
            align="right"
          >
            <HeaderCell>{""}</HeaderCell>
            <ItemActionCell role={role} tableRef={tableBody} mutate={mutate} />
          </Column>
        }
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
