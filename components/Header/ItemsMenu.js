import { Dropdown, Icon } from "rsuite";

import "../../styles/custom-header.less";

const ItemsMenu = ({ router, user }) => {
  const onHandleSelect = (eventKey) => {
    switch (eventKey) {
      case "1":
        router.push({
          pathname: `${router.pathname}/new-medicine`,
        });
        break;
      case "2":
        router.push({
          pathname: `${router.pathname}/new-meal`,
        });
        break;
      case "3":
        router.push({
          pathname: `${router.pathname}/new-enamelware`,
        });
        break;
      case "4":
        router.push({
          pathname: `${router.pathname}/new-property`,
        });
        break;
      case "5":
        router.push({
          pathname: `${router.pathname}/new-stationary`,
        });
        break;
      case "6":
        router.push({
          pathname: `${router.pathname}/new-electronic-device`,
        });
        break;
      default:
    }
  };
  return (
    <Dropdown
      title="Nuevo Insumo"
      icon={<Icon icon="plus" style={{ color: "white" }} />}
      placement="bottomStart"
      className="menu-dropdown no-full-width"
    >
      <Dropdown.Item
        className="dropdown-item"
        eventKey="1"
        onSelect={onHandleSelect}
      >
        <Icon icon="medkit" /> Medicamento
      </Dropdown.Item>
      <Dropdown.Item
        className="dropdown-item"
        eventKey="2"
        onSelect={onHandleSelect}
      >
        <Icon icon="apple" /> Alimento
      </Dropdown.Item>
      <Dropdown.Item
        className="dropdown-item"
        eventKey="3"
        onSelect={onHandleSelect}
      >
        <Icon icon="cutlery" /> Utencilio
      </Dropdown.Item>
      <Dropdown.Item
        className="dropdown-item"
        eventKey="4"
        onSelect={onHandleSelect}
      >
        <Icon icon="home" /> Inmueble
      </Dropdown.Item>
      <Dropdown.Item
        className="dropdown-item"
        eventKey="5"
        onSelect={onHandleSelect}
      >
        <Icon icon="file-text" /> Papelería
      </Dropdown.Item>
      <Dropdown.Item
        className="dropdown-item"
        eventKey="6"
        onSelect={onHandleSelect}
      >
        <Icon icon="tv" /> Equipo Electrónico
      </Dropdown.Item>
    </Dropdown>
  );
};

export default ItemsMenu;
