import { useEffect } from "react";
import error500 from "../public/img/erro500.jpg";
import { parseCookies } from "../lib/parseCookies";
import { FlexboxGrid } from "rsuite";

import "../styles/custom-theme.less";
import { useRouter } from "next/router";

const Error500Page = ({ handleLogged, handleUser, user }) => {
  const router = useRouter();
  useEffect(() => {
      if (user) {
        handleLogged(true);
        handleUser(user);
      }
      setTimeout(() => {
        router.back();
      }, 5000);
  }, []);

  return (
    <FlexboxGrid className="full-height full-width" align="middle" justify="center">
      <FlexboxGrid.Item colspan={20}>
        <h1 style={{fontSize: "64px", marginBottom: "1rem"}} className="text-center text-black text-bolder">Error 500</h1>
        <h5 className="text-center text-color-dark-gray text-medium">Ha ocurrido un error</h5>
        <h5 className="text-center text-color-dark-gray text-medium">Sera redireccionado en 5 segundos</h5>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

/*export async function getServerSideProps({req}){
  const userCookie = parseCookies(req);
  
  if(userCookie && userCookie.sialincaUser){
    
    const user = JSON.parse(userCookie.sialincaUser);
    
    return {
      props: {
        user,
      }
    }
    
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      },
      props: {}
    }
  }
}*/

export default Error500Page;
