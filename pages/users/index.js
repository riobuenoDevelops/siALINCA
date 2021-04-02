import { useEffect } from "react";
import { useRouter } from "next/router";

const UsersPage = ({ isLogged, handleLogged }) => {
  const history = useRouter();

  useEffect(() => {
    if (
      localStorage.getItem("logged") === null ||
      localStorage.getItem("logged") === "false"
    ) {
      handleLogged(false);
      history.push("/login");
    }
  }, []);

  return <h1>UsersPage</h1>;
};

export default UsersPage;
