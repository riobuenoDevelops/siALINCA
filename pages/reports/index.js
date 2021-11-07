import { useEffect } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "../../lib/parseCookies";

const ReportsPage = ({ handleLogged, handleUser, user, isError }) => {
  const history = useRouter();

  useEffect(() => {
    if (isError) {
      handleLogged(false);
    } else {
      handleLogged(true);
      handleUser(user);
    }
  }, []);

  return <h1>ReportsPage</h1>;
};

export async function getServerSideProps({ req, res }) {
  const cookies = parseCookies(req);
  if (cookies && cookies.sialincaUser) {
    const user = JSON.parse(cookies.sialincaUser);

    return {
      props: {
        user,
        isError: false,
      },
    };
  }

  return {
    props: {},
    redirect: {
      permanent: false,
      to: "/login"
    }
  }
}

export default ReportsPage;
