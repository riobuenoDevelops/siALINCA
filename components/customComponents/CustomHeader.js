import {useState} from "react";
import {
  Avatar,
  Button,
  Dropdown,
  FlexboxGrid,
  Icon,
} from "rsuite";

import AboutModal from "../modals/AboutModal";
import UserConfigurationModal from '../modals/UserConfigurationModal';

import SedesApplicantsMenu from "../Header/SedesApplicantsMenu";
import ItemsMenu from "../Header/ItemsMenu";
import NotesMenu from "../Header/NotesMenu";
import ReportsMenu from "../Header/ReportsMenu";

import "../../styles/custom-header.less";
import { useCurrentUser } from "../../hooks";

const CustomHeader = ({
  router,
  expanded,
  user,
  handleUserModalOpen,
  handleStoreModalOpen,
  handleApplicantModalOpen,
  handleSedeModalOpen,
}) => {
  const [showAboutModal, handleAboutModal] = useState(false);
  const [configurationModalOpen, setConfigurationModalOpen] = useState(false);
  const { removeCookie } = useCurrentUser();

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
    removeCookie('sialincaUser');
    router.push("/login");
  };

  const renderCustomMenu = () => {
    if (user?.user?.roleName !== "guest") {
      switch (router.pathname) {
        case "/items":
          return <ItemsMenu router={router} user={user?.user} />;
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
          return <NotesMenu router={router} />;
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
        <FlexboxGrid.Item colspan={expanded ? 19 : 20}>
          {renderCustomMenu()}
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={expanded ? 5 : 4} className="user-col">
          <Avatar size="sm" circle style={{ marginRight: "0.5em" }}>
            <Icon icon="user" />
          </Avatar>
          <Dropdown
            placement="bottomEnd"
            title={`${user?.user?.names ? "Hola, " + user?.user?.names.split(" ")[0] : "Bienvenido"}${user?.user?.lastNames ? " " + user?.user?.lastNames.charAt(
              0
            ) + "." : ""}`}
            className="user-dropdown"
          >
            <Dropdown.Item
              className="dropdown-item"
              onSelect={() => setConfigurationModalOpen(true)}
              icon={<Icon icon="cog" />}
            >
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
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <AboutModal
        showAboutModal={showAboutModal}
        onCloseAboutModal={onCloseAboutModal}
      />
      <UserConfigurationModal
        isOpen={configurationModalOpen}
        onClose={() => setConfigurationModalOpen(false)}
        user={user}
      />
    </>
  );
};

export default CustomHeader;
