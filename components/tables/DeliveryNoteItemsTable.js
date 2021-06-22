import { Icon, IconButton, Table } from "rsuite";

import "../../styles/custom-theme.less";

const DeleteCell = ({ handleData, data, rowData, dataKey, ...props }) => {
  const onDeleteItem = () => {
    handleData(data.filter((item) => item.itemId !== rowData[dataKey]));
  };

  return (
    <Table.Cell {...props}>
      <IconButton circle icon={<Icon icon="trash" />} onClick={onDeleteItem} />
    </Table.Cell>
  );
};

export default function DeliveryNoteItemsTable({ data, handleData }) {
  const { HeaderCell, Cell, Column } = Table;

  return (
    <Table
      autoHeight
      className="header-table"
      style={{ marginTop: "1rem" }}
      headerHeight={50}
      rowHeight={60}
      width="100%"
      data={data}
    >
      <Column flexGrow={2} verticalAlign="middle">
        <HeaderCell style={{ backgroundColor: "rgba(0, 191, 228, 0.5)" }}>
          <h6 className="text-black text-bold">Almacén</h6>
        </HeaderCell>
        <Cell dataKey="storeName" />
      </Column>
      <Column flexGrow={3} verticalAlign="middle">
        <HeaderCell style={{ backgroundColor: "rgba(0, 191, 228, 0.5)" }}>
          <h6 className="text-black text-bold">Item</h6>
        </HeaderCell>
        <Cell dataKey="itemName" />
      </Column>
      <Column flexGrow={1} verticalAlign="middle">
        <HeaderCell style={{ backgroundColor: "rgba(0, 191, 228, 0.5)" }}>
          <h6 className="text-black text-bold">Cantidad</h6>
        </HeaderCell>
        <Cell dataKey="quantity" />
      </Column>
      <Column flexGrow={1} verticalAlign="middle" align="right">
        <HeaderCell style={{ backgroundColor: "rgba(0, 191, 228, 0.5)" }}>
          <h6 className="text-black text-bold">Acciones</h6>
        </HeaderCell>
        <DeleteCell dataKey="itemId" handleData={handleData} data={data} />
      </Column>
    </Table>
  );
};
