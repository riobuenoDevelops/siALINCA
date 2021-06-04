import { useEffect, useState } from "react";
import { parseCookies } from "../../lib/parseCookies";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { FlexboxGrid, Nav, Notification } from "rsuite";
import routes from "../../config/routes";
import AxiosService from "../../services/Axios";
import SedeServices from "../../services/Sede";
import ApplicantService from "../../services/Applicant";

import SearchInput from "../../components/Search/SearchInput";
import SedesTable from "../../components/tables/SedesTable";
import SedeFormModal from "../../components/modals/SedeFormModal";
import ApplicantFormModal from "../../components/modals/ApplicantFormModal";
import ApplicantsTable from "../../components/tables/ApplicantsTable";

const SedesApplicantsPage = ({
                               handleLogged,
                               handleUser,
                               user,
                               sedes,
                               applicants,
                               isError,
                               handleSedeModalOpen,
                               handleApplicantModalOpen,
                               sedeModalIsOpen,
                               applicantModalIsOpen,
                             }) => {
  const history = useRouter();
  const {i18n} = useTranslation();
  const [searchSedeInputValue, handleSearchSedeInputValue] = useState("");
  const [searchApplicantInputValue, handleSearchApplicantInputValue] = useState(
    ""
  );
  const [tabActive, handleTabActive] = useState("sedes");
  const [isUpdateSede, handleUpdateSede] = useState(false);
  const [isUpdateApplicant, handleUpdateApplicant] = useState(false);
  const [sedeLoading, handleSedeLoading] = useState(false);
  const [applicantLoading, handleApplicantLoading] = useState(false);
  const [selectedSede, handleSelectedSede] = useState({});
  const [selectedApplicant, handleSelectedApplicant] = useState({});
  const [sedeDepartments, handleSedeDepartments] = useState([]);
  
  useEffect(() => {
    if (isError && !user) {
      handleLogged(false);
      history.push("/login");
    } else {
      handleLogged(true);
      handleUser(user);
    }
  }, []);
  
  const onSelectActive = (eventeKey) => {
    handleTabActive(eventeKey);
  };
  
  const onSubmitUpdateSede = async (data) => {
    handleSedeLoading(true);
    
    const sedeData = {
      name: data.name,
      addressLine: data.addressLine,
      addressState: data.addressState,
      addressCountry: data.addressCountry,
      addressCity: data.addressCity,
      addressZipcode: data.addressZipcode,
      departments: sedeDepartments.map((item) => item.department),
    };
    
    try {
      if (isUpdateSede) {
        await AxiosService.instance.put(
          routes.sedes + `/${selectedSede._id}`,
          sedeData,
          {
            headers: {
              Authorization: user.token,
            },
          }
        );
      } else {
        await AxiosService.instance.post(routes.sedes, sedeData, {
          headers: {
            Authorization: user.token,
          },
        });
      }
      Notification.success({
        title: !isUpdateSede ? "Nueva sede" : "Sede Actualizada",
        description: !isUpdateSede
          ? "Se ha creado la sede exitosamente"
          : "Se ha actualizado la sede exitosamente",
        duration: 9000,
        placement: "bottomStart",
      });
      history.replace(history.asPath);
    } catch (err) {
      console.error(err.response.data.message);
    }
    handleSedeLoading(false);
    handleSedeModalOpen(false);
    handleUpdateSede(false);
  };
  
  const onSubmitUpdateApplicant = async (data) => {
    handleApplicantLoading(true);
    
    const applicantData = {
      names: data.names,
      lastNames: data.lastNames,
      cedula: data.cedula,
      phone: data.phone,
    };
    
    try {
      if (isUpdateApplicant) {
        await AxiosService.instance.put(
          routes.applicants + `/${selectedApplicant._id}`,
          applicantData,
          {
            headers: {
              Authorization: user.token,
            },
          }
        );
      } else {
        await AxiosService.instance.post(routes.applicants, applicantData, {
          headers: {
            Authorization: user.token,
          },
        });
      }
      Notification.success({
        title: !isUpdateApplicant ? "Nuevo Solicitante" : "Solicitante Actualizado",
        description: !isUpdateApplicant
          ? "Se ha creado el solicitante exitosamente"
          : "Se ha actualizado el solicitante exitosamente",
        duration: 9000,
        placement: "bottomStart",
      });
      history.replace(history.asPath);
    } catch (err) {
      console.error(err.response.data.message);
    }
    handleApplicantLoading(false);
    handleApplicantModalOpen(false);
    handleUpdateApplicant(false);
  };
  
  return (
    <>
      <FlexboxGrid>
        <FlexboxGrid.Item colspan={16} style={{paddingBottom: "2em"}}>
          <h3 className="text-black text-bolder">
            Sedes y Solicitantes ({i18n.t(`roles.${user?.user?.roleName}`)})
          </h3>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={8}>
          <SearchInput
            placehoderLabel={tabActive === "sedes" ? "sede" : "solicitante"}
            data={[]}
            handleValue={
              tabActive === "sedes"
                ? handleSearchSedeInputValue
                : handleSearchApplicantInputValue
            }
            value={
              tabActive === "sedes"
                ? searchSedeInputValue
                : searchApplicantInputValue
            }
          />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <Nav
            className="tabs"
            appearance="tabs"
            active={tabActive}
            onSelect={onSelectActive}
            style={{marginBottom: "1.5rem"}}
          >
            <Nav.Item
              className={tabActive === "sedes" ? "active" : ""}
              eventKey="sedes"
            >
              <span>Sedes</span>
            </Nav.Item>
            <Nav.Item
              className={tabActive === "applicants" ? "active" : ""}
              eventKey="applicants"
            >
              <span>Applicantes</span>
            </Nav.Item>
          </Nav>
          {tabActive === "sedes" ? (
            <SedesTable
              handleUpdateSede={handleUpdateSede}
              handleSelectedSede={handleSelectedSede}
              items={sedes}
              searchInputValue={searchSedeInputValue}
              handleSedeModalOpen={handleSedeModalOpen}
              handleSedeDepartments={handleSedeDepartments}
            />
          ) : (
            <ApplicantsTable searchInputValue={searchApplicantInputValue}
              items={applicants}
              handleApplicantModalOpen={handleApplicantModalOpen}
              handleSelectedApplicant={handleSelectedApplicant}
              handleUpdateApplicant={handleUpdateApplicant}
            />
          )}
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <SedeFormModal
        handleOpen={handleSedeModalOpen}
        isOpen={sedeModalIsOpen}
        onSubmit={onSubmitUpdateSede}
        isUpdateSede={isUpdateSede}
        sedeLoading={sedeLoading}
        selectedSede={selectedSede}
        sedeDepartments={sedeDepartments}
        handleSedeDepartments={handleSedeDepartments}
      />
      <ApplicantFormModal onSubmit={onSubmitUpdateApplicant} isOpen={applicantModalIsOpen} handleOpen={handleApplicantModalOpen} applicantLoading={applicantLoading} isUpdateApplicant={isUpdateApplicant} selectedApplicant={selectedApplicant} />
    </>
  );
};

export async function getServerSideProps({req, res}) {
  const cookies = parseCookies(req);
  let user, sedes, applicants;
  if (cookies && cookies.sialincaUser) {
    try {
      user = JSON.parse(cookies.sialincaUser);
      
      sedes = await SedeServices.getSedes({});
      sedes = sedes.map((sede) => ({...sede, _id: sede._id.toString()}));
      
      applicants = await ApplicantService.getApplicants({});
      applicants = applicants.map((app) => ({...app, _id: app._id.toString()}));
      
      return {
        props: {
          user,
          sedes: sedes || [],
          applicants: applicants || [],
          isError: false,
        },
      };
    } catch (err) {
      return {
        props: {
          user,
          sedes: sedes || [],
          applicants: applicants || [],
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

export default SedesApplicantsPage;
