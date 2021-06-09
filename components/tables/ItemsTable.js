import React, { useState } from "react";
import {useTranslation} from "react-i18next";
import {
  Dropdown,
  Icon,
  IconButton,
  Popover,
  Table,
  Whisper,
} from "rsuite";

import "../../styles/custom-theme.less";
import StatusCell from "./customCells/StatusCell";

const TypeCell = ({ rowData, rowKey, dataKey, ...props }) => {
  const { t } = useTranslation();

  return (
    <Table.Cell {...props}>
      <span>{t(`categories.${rowData[dataKey]}`)}</span>
    </Table.Cell>
  )
}

const ActionCell = ({ tableRef, rowData, rowKey, ...props }) => {
  const Menu = ({ onSelect }) => (
    <Dropdown.Menu onSelect={onSelect}>
      <Dropdown.Item eventKey={3}>Editar</Dropdown.Item>
      <Dropdown.Menu title="Realizar Orden" pullLeft>
        <Dropdown.Item eventKey={4}>Con Retorno</Dropdown.Item>
        <Dropdown.Item eventKey={4}>Sin Retorno</Dropdown.Item>
      </Dropdown.Menu>
      <Dropdown.Item eventKey={5}>Dehabilitar</Dropdown.Item>
      <Dropdown.Item divider />
      <Dropdown.Item eventKey={7}>Eliminar</Dropdown.Item>
    </Dropdown.Menu>
  );

  const MenuPopover = ({ onSelect, ...rest }) => (
    <Popover {...rest} full>
      <Menu onSelect={onSelect} />
    </Popover>
  );

  const CustomWhisper = ({ tableRef, children }) => {
    let trigger = React.createRef();
    const handleSelectMenu = (eventKey, event) => {
      console.log(eventKey);
      trigger.hide();
    };

    return (
      <Whisper
        placement="autoVerticalEnd"
        trigger="click"
        triggerRef={(ref) => {
          trigger = ref;
        }}
        container={() => {
          return tableRef;
        }}
        speaker={<MenuPopover onSelect={handleSelectMenu} />}
      >
        {children}
      </Whisper>
    );
  };

  return (
    <Table.Cell {...props}>
      <CustomWhisper tableRef={tableRef}>
        <IconButton
          circle
          appearance="default"
          className="bg-color-white"
          icon={<Icon icon="more" />}
        />
      </CustomWhisper>
    </Table.Cell>
  );
};

const ItemsTable = ({ items, handleItems, searchInputValue }) => {
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
            : item.name.toLowerCase().includes(searchInputValue.toLowerCase())
        )}
        wordWrap
        autoHeight
        headerHeight={50}
        rowHeight={60}
        onRowClick={(row) => console.log(row)}
        className="header-table shadow"
        bodyRef={(ref) => {
          tableBody = ref;
        }}
      >
        <Column
          verticalAlign="middle"
          flexGrow={2}
          style={{ paddingLeft: "1.5em" }}
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
        <Column verticalAlign="middle" flexGrow={1}>
          <HeaderCell>
            <h6 className="text-black text-bold">Status</h6>
          </HeaderCell>
          <StatusCell  />
        </Column>
        <Column
          verticalAlign="middle"
          flexGrow={1}
          align="right"
          style={{ paddingRight: "1.5em" }}
        >
          <HeaderCell>{""}</HeaderCell>
          <ActionCell tableRef={tableBody} />
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
export default ItemsTable;
