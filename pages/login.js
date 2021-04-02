import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Grid, Row, Col, FlexboxGrid, Message, Button } from "rsuite";
import logo from "../public/img/logo.png";
import inventoryImage from "../public/img/inventoryLogo.jpg";

import LoginForm from "../components/forms/LoginForm";

const LoginPage = ({ handleLogged }) => {
  const history = useRouter();
  const [errorMessage, handleErrorMessage] = useState("");

  useEffect(() => {
    if (
      localStorage.getItem("logged") !== null &&
      localStorage.getItem("logged") === false
    ) {
      handleLogged(true);
      history.push("/items");
    }
  });

  const onSubmit = async (data) => {
    try {
      handleLogged(true);
      if (data.rememberme) {
        localStorage.setItem("logged", true);
      }
      history.push("/items");
    } catch (err) {
      handleErrorMessage(err.message);
    }
  };

  return (
    <Grid
      fluid
      className="full-height"
      style={{ position: "relative", zIndex: 5 }}
    >
      <Message
        full
        showIcon
        closable
        type="error"
        description={errorMessage}
        style={{
          display: errorMessage !== "" ? "" : "none",
          zIndex: 100,
          overflowX: "hidden",
        }}
      />
      <Row className="full-height">
        <Col
          xsHidden
          xs={12}
          className="full-height"
          style={{ backgroundColor: "white" }}
        >
          <img
            style={{ height: "100%", width: "100%" }}
            src={inventoryImage}
            alt="Inventory Cover"
          />
        </Col>
        <Col className="full-height" xs={12} style={{ padding: "2em" }}>
          <Row className="text-right full-height">
            <img className="logo" src={logo} alt="logo" />
            <LoginForm onSubmit={onSubmit} errorMessage={errorMessage} />
          </Row>
        </Col>
      </Row>
    </Grid>
  );
};

export default LoginPage;
