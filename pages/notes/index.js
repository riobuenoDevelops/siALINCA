import { useEffect } from "react";
import { useRouter } from "next/router";

const NotesPage = ({ isLogged, handleLogged }) => {
	const history = useRouter();

	useEffect(() => {
		debugger;
		if (
			localStorage.getItem("logged") === null ||
			(localStorage.getItem("logged") !== null &&
				localStorage.getItem("logged") === "false" &&
				!isLogged)
		) {
			handleLogged(false);
			history.push("/login");
		}
	}, []);

	return <h1>NotesPage</h1>;
};

export default NotesPage;
