import { useState } from "react";
import { Icon, Nav, Sidenav } from "rsuite";

import "../../styles/side-navbar.less";

const SideNavbar = ({ expanded, location, history }) => {
  const [activeKey, handleActiveKey] = useState("1");

  const onSelect = (eventKey, event) => {
    handleActiveKey(eventKey);
    switch (eventKey) {
      case "1":
        if (location.pathname !== "/items") history.push("/items");
        break;
      case "2":
        if (location.pathname !== "/users") history.push("/users");
        break;
      case "3":
        if (location.pathname !== "/notes") history.push("/notes");
        break;
      case "4":
        if (location.pathname !== "/reports") history.push("/reports");
        break;
    }
  };

  return (
    <Sidenav
      expanded={expanded}
      activeKey={activeKey}
      appearance="inverse"
      onSelect={onSelect}
    >
      <Sidenav.Body>
        <Nav>
          <Nav.Item
            className={`sidenavbar-item ${
              activeKey === "1" ? "sidenavbar-item-active" : ""
            }`}
            eventKey="1"
            icon={<Icon icon="cubes" />}
          >
            Inventario
          </Nav.Item>
          <Nav.Item
            className={`sidenavbar-item ${
              activeKey === "2" ? "sidenavbar-item-active" : ""
            }`}
            eventKey="2"
            icon={<Icon icon="group" />}
          >
            Usuarios
          </Nav.Item>
          <Nav.Item
            className={`sidenavbar-item ${
              activeKey === "3" ? "sidenavbar-item-active" : ""
            }`}
            eventKey="3"
            icon={<Icon icon="file-text" />}
          >
            Notas de Entrega
          </Nav.Item>
          <Nav.Item
            className={`sidenavbar-item ${
              activeKey === "4" ? "sidenavbar-item-active" : ""
            }`}
            eventKey="4"
            icon={<Icon icon="bar-chart" />}
          >
            Reportes
          </Nav.Item>
        </Nav>
      </Sidenav.Body>
    </Sidenav>
  );
};

export default SideNavbar;
