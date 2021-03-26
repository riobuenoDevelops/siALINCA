import { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";
import ItemsPage from "./items";
import LoggedLayout from "./LoggedLayout";

import LoginPage from "./login";
import NotesPage from "./NotesPage";
import ReportsPage from "./ReportsPage";
import UsersPage from "./UsersPage";

function Home({ children }) {
	const [isLogged, handleLogged] = useState(false);

	useEffect(() => {
		localStorage.setItem("logged", false);
	});

	return (
		<BrowserRouter>
			<LoggedLayout isLogged={isLogged} handleLogged={handleLogged}>
				<Switch>
					<Route exact path="/">
						<Redirect to="/login" />
					</Route>
					<Route exact path="/login">
						<LoginPage isLogged={isLogged} handleLogged={handleLogged} />
					</Route>
					<Route exact path="/items">
						<ItemsPage isLogged={isLogged} handleLogged={handleLogged} />
					</Route>
					<Route exact path="/users">
						<UsersPage isLogged={isLogged} handleLogged={handleLogged} />
					</Route>
					<Route exact path="/notes">
						<NotesPage isLogged={isLogged} handleLogged={handleLogged} />
					</Route>
					<Route exact path="/reports">
						<ReportsPage isLogged={isLogged} handleLogged={handleLogged} />
					</Route>
				</Switch>
			</LoggedLayout>
		</BrowserRouter>
	);
}

export default withTranslation(["translation"])(Home);
