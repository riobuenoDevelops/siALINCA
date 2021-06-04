import { useEffect } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "../../lib/parseCookies";

const NotesPage = ({ isLogged, handleLogged, handleUser, user, isError }) => {
  const history = useRouter();

  useEffect(() => {
    if (isError || !user) {
      handleLogged(false);
      history.push("/login");
    } else {
      handleLogged(true);
      handleUser(user);
    }
  }, []);

  return <h1>NotesPage</h1>;
};

export async function getServerSideProps({ req, res }) {
  const cookies = parseCookies(req);
  if (cookies && cookies.sialincaUser) {
    try {
      const user = JSON.parse(cookies.sialincaUser);

      return {
        props: {
          user,
          isError: false,
        },
      };
    } catch (err) {
      return {
        props: {
          isError: true,
        },
      };
    }
  } else {
    return {
      props: {
        isError: true,
      },
    };
  }
}

export default NotesPage;
