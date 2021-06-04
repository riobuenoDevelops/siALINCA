import Router from "next/router";
import Head from "next/head";
import { useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../utils/i18n/index";

import LoggedLayout from "../components/layouts/LoggedLayout";
import LoadingScreen from "../components/layouts/LoadingScreen";

import "rsuite/lib/styles/index.less";
import "../styles/custom-theme.less";

function MyApp({ Component, pageProps }) {
  const [isLogged, handleLogged] = useState(false);
  const [user, handleUser] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Sistema de Inventario ALINCA</title>
        />
      </Head>
      <I18nextProvider i18n={i18n}>
        <LoggedLayout
          isLogged={isLogged}
          handleLogged={handleLogged}
          user={user}
          handleUser={handleUser}
        >
          {loading ? <LoadingScreen /> : <Component {...pageProps} />}
        </LoggedLayout>
      </I18nextProvider>
    </>
  );
}

export default MyApp;
