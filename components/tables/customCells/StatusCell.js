import { Table } from "rsuite";

const StatusCell = ({ rowData, rowKey, ...props }) => {
  return (
    <Table.Cell {...props}>
      {rowData.disabled ? "Inactivo" : "Activo"}
    </Table.Cell>
  );
};

export default StatusCell;
