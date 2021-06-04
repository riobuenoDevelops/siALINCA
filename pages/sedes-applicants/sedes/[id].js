import { useEffect } from "react";
import { parseCookies } from "../../../lib/parseCookies";
import SedeService from "../../../services/Sede";
import { useRouter } from "next/router";
import Crc from "country-state-city";
import { FlexboxGrid, Icon, IconButton, Tooltip, Whisper } from "rsuite";

import "../../../styles/custom-theme.less";

const SedeDetailPage = ({sede, isError, user, handleUser, handleLogged}) => {
  const router = useRouter();
  
  useEffect(() => {
    if (isError) {
      router.push("/500");
    }
    handleLogged(true);
    handleUser(user);
  })
  
  const onBack = () => {
    router.push("/sedes-applicants");
  }
  
  return (
    <FlexboxGrid>
      <FlexboxGrid.Item colspan={1} style={{padding: "0.3rem 0"}}>
        <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>A Sedes y Applicantes</Tooltip>}>
          <IconButton appearance="primary" onClick={onBack} className="bg-color-secundary" circle size="md"
                      icon={<Icon icon="angle-left" size="lg" className="text-white"/>}/>
        </Whisper>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={20}>
        <h2 className="text-bolder">{sede.name}</h2>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={3} style={{display: "flex", justifyContent: "flex-end"}}>
        <IconButton appearence="primary" style={{marginRight: "0.5rem"}} className="bg-default"
                    icon={<Icon icon="edit"/>} circle/>
        <IconButton appearence="primary" style={{marginRight: "0.5rem"}} className="bg-default"
                    icon={<Icon icon={sede.disabled ? "circle" : "circle-o"}/>} circle/>
        <IconButton appearence="primary" className="bg-default" icon={<Icon icon="trash"/>} circle/>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24} style={{marginTop: "2rem"}}>
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={12} className="info-box shadow">
            <h4 className="text-color-primary text-bolder">Información General</h4>
            <FlexboxGrid className="info">
              <FlexboxGrid.Item>
                <span>Código</span>
                <p>{sede._id}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={1}/>
              <FlexboxGrid.Item>
                <span>Número de Departamentos</span>
                <p>{sede.departments.length}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={1}/>
              <FlexboxGrid.Item>
                <span>Estado</span>
                <p>{sede.disabled ? "Inactivo" : "Activo"}</p>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={1}/>
          <FlexboxGrid.Item colspan={11} className="info-box shadow">
            <h4 className="text-color-primary text-bolder">Ubicación</h4>
            <FlexboxGrid className="info">
              <FlexboxGrid.Item>
                <span>Dirección</span>
                <p>{sede.addressLine}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={1}/>
              <FlexboxGrid.Item>
                <span>Ciudad</span>
                <p>{sede.addressCity}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={1}/>
              <FlexboxGrid.Item>
                <span>Código Postal</span>
                <p>{sede.addressZipcode}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={1}/>
              <FlexboxGrid.Item>
                <span>Estado</span>
                <p>{Crc.getStatesOfCountry(sede.addressCountry).filter((item) => item.isoCode === sede.addressState)[0].name}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={1}/>
              <FlexboxGrid.Item>
                <span>País</span>
                <p>{Crc.getCountryByCode(sede.addressCountry).name}</p>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
}

export async function getServerSideProps({req, params}) {
  let user, sede;
  const userCookie = parseCookies(req);
  if (userCookie && userCookie.sialincaUser) {
    
    try {
      user = JSON.parse(userCookie.sialincaUser);
      
      sede = await SedeService.getSede({id: params.id});
      
      return {
        props: {
          sede: sede ? {...sede, _id: sede._id.toString()} : {},
          user,
          isError: false,
        }
      }
    } catch (err) {
      return {
        props: {
          sede: sede ? {...sede, _id: sede._id.toString()} : {},
          user,
          isError: true,
        }
      }
    }
  }
  
  return {
    redirect: {
      permanent: false,
      destination: "/login"
    },
    props: {},
  }
}

export default SedeDetailPage;