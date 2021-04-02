import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Header,
  Content,
  Footer,
  Sidebar,
  Icon,
  IconButton,
} from "rsuite";

//Styles
import "../../styles/logged-layout.less";
import CustomHeader from "../customComponents/CustomHeader";
import SideNavbar from "./SideNavbar";

const LoggedLayout = ({ isLogged, handleLogged, children }) => {
  const history = useRouter();
  const [expanded, handleExpanded] = useState(true);

  const onHandleExpanded = () => {
    handleExpanded(!expanded);
  };

  return (
    <Container className="logged-layout-container">
      <Sidebar
        className="logged-layout-sidebar"
        style={{ display: isLogged ? "flex" : "none" }}
        width={expanded ? 260 : 56}
        collapsible
      >
        <div
          style={{
            width: "100%",
            minHeight: "5em",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: "2em",
            paddingLeft: ".68em",
          }}
        >
          <IconButton
            icon={<Icon icon="bars" size="lg" style={{ color: "white" }} />}
            appearance="primary"
            onClick={onHandleExpanded}
          />
        </div>
        <SideNavbar
          expanded={expanded}
          location={history.pathname}
          history={history}
        />
      </Sidebar>
      <Container className="logged-layout-content-container">
        <Header
          className="logged-layout-header"
          style={{ display: isLogged ? "initial" : "none" }}
        >
          <CustomHeader
            location={history.pathname}
            expanded={expanded}
            history={history}
            handleLogged={handleLogged}
          />
        </Header>
        <Content
          className={
            isLogged
              ? "logged-layout-content"
              : "logged-layout-content-container"
          }
        >
          {React.cloneElement(children, { isLogged, handleLogged })}
        </Content>
      </Container>
    </Container>
  );
};

export default LoggedLayout;
