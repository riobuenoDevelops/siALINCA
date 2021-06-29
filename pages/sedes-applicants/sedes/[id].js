import { useEffect } from "react";
import { parseCookies } from "../../../lib/parseCookies";
import { useRouter } from "next/router";
import { FlexboxGrid } from "rsuite";
import Crc from "country-state-city";

import "../../../styles/custom-theme.less";
import {useNotesBySede, useSede} from "../../../hooks";
import LoadingScreen from "../../../components/layouts/LoadingScreen";
import BackButton from "../../../components/common/BackButton";
import BasicActionsButtonGroup from "../../../components/customComponents/BasicActionsButtonGroup";
import NotesTable from "../../../components/tables/NotesTable";

export default function SedeDetailPage({isError, user, handleUser, handleLogged}) {
  const router = useRouter();
  const { id } = router.query;
  const { sede, isLoading: sedeLoading } = useSede(user.token, id);
  const { sedeNotes, isLoading: notesLoading } = useNotesBySede(id, user.token);
  
  useEffect(() => {
    if (isError) {
      handleLogged(false);
    } else {
      handleLogged(true);
      handleUser(user);
    }
  }, []);

  if(sedeLoading || notesLoading) return <LoadingScreen />
  
  return (
    <FlexboxGrid>
      <FlexboxGrid.Item colspan={1} style={{padding: "0.3rem 0"}}>
        <BackButton route="/sedes-applicants" placeholder="A Sedes y Aplicantes" />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={20}>
        <h2 className="text-bolder">{`Sede ${sede?.name}`}</h2>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={3} style={{display: "flex", justifyContent: "flex-end"}}>
        <BasicActionsButtonGroup
          token={user.token}
          disabled={sede?.disabled}
          onDelete={null}
          onEdit={null}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24} style={{marginTop: "2rem"}}>
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={12} className="info-box shadow">
            <h4 className="text-color-primary text-bolder">Información General</h4>
            <FlexboxGrid className="info" justify="space-between">
              <FlexboxGrid.Item>
                <span>Código</span>
                <p>{sede?._id}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item>
                <span>Estado</span>
                <p>{sede?.disabled ? "Inactivo" : "Activo"}</p>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={1}/>
          <FlexboxGrid.Item colspan={11} className="info-box shadow">
            <h4 className="text-color-primary text-bolder">Ubicación</h4>
            <FlexboxGrid className="info">
              <FlexboxGrid.Item>
                <span>Dirección</span>
                <p>{sede?.addressLine}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={1}/>
              <FlexboxGrid.Item>
                <span>Ciudad</span>
                <p>{sede?.addressCity}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={1}/>
              <FlexboxGrid.Item>
                <span>Código Postal</span>
                <p>{sede?.addressZipcode}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={1}/>
              <FlexboxGrid.Item>
                <span>Estado</span>
                <p>{Crc.getStatesOfCountry(sede?.addressCountry).filter((item) => item.isoCode === sede.addressState)[0].name}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={1}/>
              <FlexboxGrid.Item>
                <span>País</span>
                <p>{Crc.getCountryByCode(sede?.addressCountry).name}</p>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24}>
        <h4 style={{ margin: "1rem 0" }} className="text-bolder">Notas de Entrega</h4>
        <NotesTable
          token={user.token}
          notes={sedeNotes}
          searchInputValue=""
          readOnly
          withoutResponsable
        />
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
}

export async function getServerSideProps({req}) {
  let user;
  const userCookie = parseCookies(req);
  if (userCookie && userCookie.sialincaUser) {

      user = JSON.parse(userCookie.sialincaUser);
      
      return {
        props: {
          user,
          isError: false,
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
};