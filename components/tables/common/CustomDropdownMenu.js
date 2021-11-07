import { Dropdown, Icon } from "rsuite";

const CustomDropdownMenu = ({ onSelect, rowData, hasDeleted }) => (
  <Dropdown.Menu>
    <Dropdown.Item eventKey={1} onSelect={onSelect}>
      <Icon icon="edit" /> Editar
    </Dropdown.Item>
    {!hasDeleted && <Dropdown.Item divider />}
    <Dropdown.Item eventKey={2} onSelect={onSelect}>
      <Icon
        icon={rowData.disabled ? "circle" : "circle-o"}
      />
      <span>{rowData.disabled ? "Habilitar" : "Deshabilitar"}</span>
    </Dropdown.Item>
    {hasDeleted &&
      <>
        <Dropdown.Item divider />
        <Dropdown.Item eventKey={3} onSelect={onSelect}>
          <Icon
            style={{ color: "red" }}
            icon="trash"
          />
          <span style={{ color: "red" }}>Eliminar</span>
        </Dropdown.Item>
      </>
    }
  </Dropdown.Menu>
);

export default CustomDropdownMenu;