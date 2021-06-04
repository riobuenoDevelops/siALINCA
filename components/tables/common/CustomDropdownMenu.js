import { Dropdown, Icon } from "rsuite";

const CustomDropdownMenu = ({ onSelect, rowData }) => (
  <Dropdown.Menu>
    <Dropdown.Item eventKey={1} onSelect={onSelect}>
      <Icon icon="edit" /> Editar
    </Dropdown.Item>
    <Dropdown.Item divider />
    <Dropdown.Item eventKey={2} onSelect={onSelect}>
      <Icon
        style={{ color: rowData.disabled ? "inherit" : "red" }}
        icon={rowData.disabled ? "circle" : "circle-o"}
      />
      <span style={{ color: rowData.disabled ? "inherit" : "red" }}>
          {rowData.disabled ? "Habilitar" : "Deshabilitar"}
        </span>
    </Dropdown.Item>
  </Dropdown.Menu>
);

export default CustomDropdownMenu;