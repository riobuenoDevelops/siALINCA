import Head from "next/head";
import { useState } from "react";

import "rsuite/lib/styles/index.less";
import "../styles/custom-theme.less";
import LoggedLayout from "./LoggedLayout";

function MyApp({ Component, pageProps }) {
	const [isLogged, handleLogged] = useState(false);

	return (
		<>
			<Head>
				<title>Sistema de Inventario ALINCA</title>
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Epilogue&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<LoggedLayout isLogged={isLogged} handleLogged={handleLogged}>
				<Component {...pageProps} />
			</LoggedLayout>
		</>
	);
}

export default MyApp;
