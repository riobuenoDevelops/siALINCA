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

const NewSedeDepartmentTable = ({ data, handleData }) => {
  const { HeaderCell, Cell, Column } = Table;

  return (
    <Table
      autoHeight
      className="header-table"
      headerHeight={50}
      rowHeight={60}
      data={data}
    >
      <Column verticalAlign="middle" flexGrow={3}>
        <HeaderCell style={{ backgroundColor: "rgba(0, 191, 228, 0.5)" }}>
          <h6 className="text-black text-bold">Departamento</h6>
        </HeaderCell>
        <Cell dataKey="department" />
      </Column>
      <Column flexGrow={1} verticalAlign="middle" align="right">
        <HeaderCell style={{ backgroundColor: "rgba(0, 191, 228, 0.5)" }}>
          <h6 className="text-black text-bold">Acciones</h6>
        </HeaderCell>
        <DeleteCell dataKey="index" handleData={handleData} data={data} />
      </Column>
    </Table>
  );
};

export default NewSedeDepartmentTable;
