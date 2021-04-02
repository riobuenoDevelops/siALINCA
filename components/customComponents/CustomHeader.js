import { useState } from "react";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  FlexboxGrid,
  Grid,
  Icon,
  Modal,
  Row,
} from "rsuite";
import FlexboxGridItem from "rsuite/lib/FlexboxGrid/FlexboxGridItem";

import ItemsMenu from "../Header/ItemsMenu";
import NotesMenu from "../Header/NotesMenu";
import ReportsMenu from "../Header/ReportsMenu";

import "../../styles/custom-header.less";
import AboutModal from "../modals/AboutModal";

const CustomHeader = ({ history, location, expanded, handleLogged }) => {
  const [showAboutModal, handleAboutModal] = useState(false);

  const onOpenAboutModal = () => {
    handleAboutModal(true);
  };

  const onCloseAboutModal = () => {
    handleAboutModal(false);
  };

  const logout = () => {
    localStorage.setItem("logged", false);
    handleLogged(false);
    history.push("/login");
  };

  const renderCustomMenu = () => {
    switch (location.pathname) {
      case "/items":
        return <ItemsMenu />;
      case "/users":
        return (
          <Button appearance="primary" className="custom-button">
            <Icon icon="plus" style={{ paddingRight: "0.3em" }} /> Nuevo Usuario
          </Button>
        );
      case "/notes":
        return <NotesMenu />;
      case "/reports":
        return <ReportsMenu />;
      default:
        return null;
    }
  };

  return (
    <>
      <FlexboxGrid className="custom-header">
        <FlexboxGridItem colspan={expanded ? 19 : 20}>
          {renderCustomMenu()}
        </FlexboxGridItem>
        <FlexboxGridItem colspan={expanded ? 5 : 4} className="user-col">
          <Avatar size="sm" circle style={{ marginRight: "0.5em" }}>
            <Icon icon="user" />
          </Avatar>
          <Dropdown
            placement="bottomEnd"
            title="Hola, Mary F."
            className="user-dropdown"
          >
            <Dropdown.Item className="dropdown-item" icon={<Icon icon="cog" />}>
              Configuración
            </Dropdown.Item>
            <Dropdown.Item
              className="dropdown-item"
              onSelect={onOpenAboutModal}
              icon={<Icon icon="info" />}
            >
              Acerca de...
            </Dropdown.Item>
            <Dropdown.Item divider />
            <Dropdown.Item
              className="dropdown-item"
              onSelect={logout}
              icon={<Icon icon="sign-out" />}
            >
              Cerrar Sesión
            </Dropdown.Item>
          </Dropdown>
        </FlexboxGridItem>
      </FlexboxGrid>
      <AboutModal
        showAboutModal={showAboutModal}
        onCloseAboutModal={onCloseAboutModal}
      />
    </>
  );
};

export default CustomHeader;
