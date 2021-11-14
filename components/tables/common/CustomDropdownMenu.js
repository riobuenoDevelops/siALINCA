import { Dropdown, Icon } from "rsuite";

const CustomDropdownMenu = ({
  isNotAdmin,
  onSelect,
  rowData,
  hasDeleted,
  hasPDF,
  withoutEnable,
  withoutEdit
}) => (
  <Dropdown.Menu>
    {!withoutEdit &&
      <Dropdown.Item eventKey={1} onSelect={onSelect}>
        <Icon icon="edit" /> Editar
      </Dropdown.Item>
    }
    {hasPDF &&
      <Dropdown.Item eventKey={4} onSelect={onSelect}>
        <Icon icon="file" /> Generar PDF
      </Dropdown.Item>
    }
    {!hasDeleted && !isNotAdmin && <Dropdown.Item divider />}
    {!withoutEnable &&
      <Dropdown.Item eventKey={2} onSelect={onSelect}>
        <Icon
          icon={rowData.disabled ? "circle" : "circle-o"}
        />
        <span>{rowData.disabled ? "Habilitar" : "Deshabilitar"}</span>
      </Dropdown.Item>
    }
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