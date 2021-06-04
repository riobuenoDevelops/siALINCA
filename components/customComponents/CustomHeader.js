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
import cookieCutter from "cookie-cutter";

import ItemsMenu from "../Header/ItemsMenu";
import NotesMenu from "../Header/NotesMenu";
import ReportsMenu from "../Header/ReportsMenu";

import "../../styles/custom-header.less";
import AboutModal from "../modals/AboutModal";
import SedesApplicantsMenu from "../Header/SedesApplicantsMenu";

const CustomHeader = ({
  router,
  expanded,
  handleLogged,
  user,
  handleUserModalOpen,
  handleStoreModalOpen,
  handleApplicantModalOpen,
  handleSedeModalOpen,
}) => {
  const [showAboutModal, handleAboutModal] = useState(false);

  const onOpenAboutModal = () => {
    handleAboutModal(true);
  };

  const onCloseAboutModal = () => {
    handleAboutModal(false);
  };

  const onOpenUserFormModal = () => {
    handleUserModalOpen(true);
  };

  const onOpenStoreFormModal = () => {
    handleStoreModalOpen(true);
  };

  const onOpenSedeFormModal = () => {
    handleSedeModalOpen(true);
  };

  const onOpenApplicantFormModal = () => {
    handleApplicantModalOpen(true);
  };

  const logout = () => {
    cookieCutter.set("sialincaUser", "", { expires: new Date(0) });
    handleLogged(false);
    router.push("/login");
  };

  const renderCustomMenu = () => {
    if (user?.roleName !== "guest") {
      switch (router.pathname) {
        case "/items":
          return <ItemsMenu router={router} user={user} />;
        case "/users":
          return (
            <Button
              appearance="primary"
              className="custom-button"
              onClick={onOpenUserFormModal}
            >
              <Icon icon="plus" style={{ paddingRight: "0.3em" }} /> Nuevo
              Usuario
            </Button>
          );
        case "/stores":
          return (
            <Button
              appearance="primary"
              className="custom-button"
              onClick={onOpenStoreFormModal}
            >
              <Icon icon="plus" style={{ paddingRight: "0.3em" }} /> Nuevo
              Almacén
            </Button>
          );
        case "/sedes-applicants":
          return (
            <SedesApplicantsMenu
              handleOpenApplicantModal={onOpenApplicantFormModal}
              handleOpenSedeModal={onOpenSedeFormModal}
            />
          );
        case "/notes":
          return <NotesMenu />;
        case "/reports":
          return <ReportsMenu />;
        default:
          return null;
      }
    }
    return null;
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
            title={`Hola, ${user?.names.split(" ")[0]} ${user?.lastNames.charAt(
              0
            )}.`}
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
