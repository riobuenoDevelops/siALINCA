import Head from "next/head";
import electron from "electron";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { SWRConfig } from "swr";
import { CookiesProvider } from "react-cookie";
import { Notification } from "rsuite";

import i18n from "../utils/i18n/index";

import LoggedLayout from "../components/layouts/LoggedLayout";

import AxiosService from "../services/Axios";

import "rsuite/lib/styles/index.less";
import "../styles/custom-theme.less";

const ipcRenderer = electron.ipcRenderer || false;

export default function MyApp({ Component, ...pageProps }) {

  useEffect(() => {
    ipcRenderer.on("notify-critical-item", (event, data) => {
      Notification.warning({
        title: "Nivel de Inventario Crítico",
        description: `El item "${data}" ha superado el nivel mínimo de inventario`,
        placement: "bottomEnd",
        duration: "5000"
      });
    });

    return () => {
      ipcRenderer.removeAllListeners("notify-critical-item");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Sistema de Inventario ALINCA</title>
      </Head>
      <I18nextProvider i18n={i18n}>
        <SWRConfig
          value={{
            refreshInterval: 10000,
            fetcher: (url, token, query) => {
              if (!url) {
                return false;
              }
              return query
                ? AxiosService.instance.get(url, {
                  headers: {
                    Authorization: token
                  },
                  params: query
                }).then(res => res.data)
                : AxiosService.instance.get(url, {
                  headers: {
                    Authorization: token
                  },
                }).then(res => res.data)
            }
          }}
        >
          <CookiesProvider>
            <LoggedLayout>
              <Component {...pageProps} />
            </LoggedLayout>
          </CookiesProvider>
        </SWRConfig>
      </I18nextProvider>
    </>
  );
}
