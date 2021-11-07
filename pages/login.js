import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Grid, Row, Col, Message} from "rsuite";
import cookieCutter from "cookie-cutter";
import Ably from "ably/promises";

import LoginForm from "../components/forms/LoginForm";

import inventoryImage from "../public/img/inventoryLogo.jpg";
import logo from "../public/img/logo.png";

import routes from "../config/routes";

import AxiosService from "../services/Axios";

const LoginPage = ({ handleLogged, ablyClient, subscribeAbly }) => {
  const history = useRouter();
  const [errorMessage, handleErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userCookie = cookieCutter.get("sialincaUser");
    if (userCookie) {
      handleLogged(true);
      history.push("/items");
    }
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const userData = await AxiosService.instance.post(routes.login, {
        email: data.email,
        password: data.password,
      });

      const nextDay = 0.33;
      const auxDate = new Date();

      AxiosService.setAuthorizationToken(userData?.data?.token);
      cookieCutter.set("sialincaUser", JSON.stringify(userData.data), {
        expires: new Date(auxDate.getTime() + nextDay * 24 * 60 * 60 * 1000),
      });

      if(!ablyClient.connection) {
        subscribeAbly(new Ably.Realtime({ token: userData.data.ablyToken }) , userData.data.user.email);
      }

      setLoading(false);
      history.push("/items");
    } catch (err) {
      console.log(err.t0);
      handleErrorMessage(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  const onSubmitAsGuest = async () => {
    try {
      const userData = await AxiosService.instance.post(routes.login, {
        email: process.env.guestUserEmail,
        password: process.env.guestUserPassword,
      });

      AxiosService.setAuthorizationToken(userData?.data?.token);
      cookieCutter.set("sialincaUser", JSON.stringify(userData.data), {
        maxAge: 7.2e7,
      });

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
            <LoginForm
              onSubmit={onSubmit}
              onSubmitAsGuest={onSubmitAsGuest}
              errorMessage={errorMessage}
              loading={loading}
            />
          </Row>
        </Col>
      </Row>
    </Grid>
  );
};

export default LoginPage;
