import { useEffect } from "react";
import { useRouter } from "next/router";

const ReportsPage = ({ isLogged, handleLogged }) => {
	const history = useRouter();

	useEffect(() => {
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

	return <h1>ReportsPage</h1>;
};

export default ReportsPage;
