import { useState } from "react";
import { Icon, Nav, Sidenav } from "rsuite";

import "../../styles/side-navbar.less";

const SideNavbar = ({ expanded, router, roleName }) => {
  const [activeKey, handleActiveKey] = useState("1");

  const onSelect = (eventKey) => {
    handleActiveKey(eventKey);
    switch (eventKey) {
      case "1":
        if (router.pathname !== "/items") router.push("/items");
        break;
      case "2":
        if (router.pathname !== "/users") router.push("/users");
        break;
      case "3":
        if (router.pathname !== "/stores") router.push("/stores");
        break;
      case "4":
        if (router.pathname !== "/sedes-applicants")
          router.push("/sedes-applicants");
        break;
      case "5":
        if (router.pathname !== "/notes") router.push("/notes");
        break;
      case "7":
        if (router.pathname !== "/reports") router.push("/reports");
        break;
    }
  };

  const onActiveKey = () => {
    if (router.pathname.includes("/items")) return "1";
    if (router.pathname.includes("/users")) return "2";
    if (router.pathname.includes("/stores")) return "3";
    if (router.pathname.includes("/sedes-applicants")) return "4";
    if (router.pathname.includes("/notes")) return "5";
    if (router.pathname.includes("/reports")) return "7";
  };

  return (
    <Sidenav expanded={expanded} appearance="inverse" onSelect={onSelect}>
      <Sidenav.Body>
        <Nav>
          <Nav.Item
            className={`sidenavbar-item ${
              onActiveKey() === "1" ? "sidenavbar-item-active" : ""
            }`}
            eventKey="1"
            icon={<Icon icon="cubes" />}
          >
            Inventario
          </Nav.Item>
          {roleName !== "guest" && roleName !== "employee" && (
            <Nav.Item
              className={`sidenavbar-item ${
                onActiveKey() === "2" ? "sidenavbar-item-active" : ""
              }`}
              eventKey="2"
              icon={<Icon icon="user" />}
            >
              Usuarios
            </Nav.Item>
          )}
          {roleName !== "guest" && (
            <Nav.Item
              className={`sidenavbar-item ${
                onActiveKey() === "3" ? "sidenavbar-item-active" : ""
              }`}
              eventKey="3"
              icon={<Icon icon="home" />}
            >
              Almacenes
            </Nav.Item>
          )}
          {roleName !== "guest" && (
            <Nav.Item
              className={`sidenavbar-item ${
                onActiveKey() === "4" ? "sidenavbar-item-active" : ""
              }`}
              eventKey="4"
              icon={<Icon icon="group" />}
            >
              Sedes y Aplicantes
            </Nav.Item>
          )}
          {roleName !== "guest" && (
            <Nav.Item
              className={`sidenavbar-item ${
                onActiveKey() === "5" ? "sidenavbar-item-active" : ""
              }`}
              eventKey="5"
              icon={<Icon icon="file-text" />}
            >
              Notas de Entrega
            </Nav.Item>
          )}
          {roleName !== "guest" && roleName !== "employee" && (
            <Nav.Item
              className={`sidenavbar-item ${
                onActiveKey() === "7" ? "sidenavbar-item-active" : ""
              }`}
              eventKey="7"
              icon={<Icon icon="bar-chart" />}
            >
              Reportes
            </Nav.Item>
          )}
        </Nav>
      </Sidenav.Body>
    </Sidenav>
  );
};

export default SideNavbar;
