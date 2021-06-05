import { Icon, IconButton, Table } from "rsuite";

import "../../styles/custom-theme.less";

const DeleteCell = ({ handleData, data, rowData, dataKey, ...props }) => {
  const onDeleteItem = () => {
    handleData(data.filter((item) => item.index !== rowData[dataKey]));
  };

  return (
    <Table.Cell {...props}>
      <IconButton circle icon={<Icon icon="trash" />} onClick={onDeleteItem} />
    </Table.Cell>
  );
};

const NewItemStoreTable = ({ data, handleData }) => {
  const { HeaderCell, Cell, Column } = Table;

  return (
    <Table
      autoHeight
      className="header-table"
      headerHeight={50}
      rowHeight={60}
      width="100%"
      data={data}
    >
      <Column flexGrow={3} verticalAlign="middle">
        <HeaderCell style={{ backgroundColor: "rgba(0, 191, 228, 0.5)" }}>
          <h6 className="text-black text-bold">Almacén</h6>
        </HeaderCell>
        <Cell dataKey="store" />
      </Column>
      <Column flexGrow={1} verticalAlign="middle">
        <HeaderCell style={{ backgroundColor: "rgba(0, 191, 228, 0.5)" }}>
          <h6 className="text-black text-bold">Cantidad</h6>
        </HeaderCell>
        <Cell dataKey="quantity" />
      </Column>
      <Column flexGrow={1} verticalAlign="middle">
        <HeaderCell style={{ backgroundColor: "rgba(0, 191, 228, 0.5)" }}>
          <h6 className="text-black text-bold">Acciones</h6>
        </HeaderCell>
        <DeleteCell dataKey="index" handleData={handleData} data={data} />
      </Column>
    </Table>
  );
};

export default NewItemStoreTable;
