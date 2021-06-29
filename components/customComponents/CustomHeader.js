import {useEffect, useState} from "react";
import {
  Avatar,
  Button,
  Dropdown,
  FlexboxGrid,
  Icon,
  Notification
} from "rsuite";
import PubNub from "pubnub";
import cookieCutter from "cookie-cutter";

import AboutModal from "../modals/AboutModal";
import SedesApplicantsMenu from "../Header/SedesApplicantsMenu";
import ItemsMenu from "../Header/ItemsMenu";
import NotesMenu from "../Header/NotesMenu";
import ReportsMenu from "../Header/ReportsMenu";

import "../../styles/custom-header.less";

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
  const [channels] = useState(['notifications']);
  const pubNub = new PubNub({
    publishKey: process.env.NEXT_PUBLIC_PUBLISH_KEY,
    subscribeKey: process.env.NEXT_PUBLIC_SUBSCRIBE_KEY,
    uuid: user?.user?.email
  });

  const handleNotification = event => {
    const message = event.message;
    if (typeof message === 'string' || message.hasOwnProperty('text')) {
      const text = message.text || message;
      Notification.warning({
        placement: "bottomEnd",
        title: "Nivel de Inventario Critico",
        description: text,
        duration: 9000,
      })
    }
  }

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
          return <NotesMenu router={router} />;
        case "/reports":
          return <ReportsMenu />;
        default:
          return null;
      }
    }
    return null;
  };

  useEffect(() => {
    pubNub.addListener({ message: handleNotification });
    pubNub.subscribe({ channels });
  }, [channels])

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
            title={`Hola, ${user?.names ? user.names.split(" ")[0] : "Invitado"} ${user?.lastNames ? user.lastNames.charAt(
              0
            ) : ""}.`}
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
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <AboutModal
        showAboutModal={showAboutModal}
        onCloseAboutModal={onCloseAboutModal}
      />
    </>
  );
};

export default CustomHeader;
