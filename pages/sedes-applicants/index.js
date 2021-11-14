import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { FlexboxGrid, Nav, Notification } from "rsuite";

import SearchInput from "../../components/Search/SearchInput";
import SedesTable from "../../components/tables/SedesTable";
import SedeFormModal from "../../components/modals/SedeFormModal";
import ApplicantFormModal from "../../components/modals/ApplicantFormModal";
import ApplicantsTable from "../../components/tables/ApplicantsTable";
import LoadingScreen from "../../components/layouts/LoadingScreen";

import { useApplicants, useCurrentUser, useSedes } from "../../hooks";
import routes from "../../config/routes";
import AxiosService from "../../services/Axios";

export default function SedesApplicantsPage ({
  handleLogged,
  user,
  handleSedeModalOpen,
  handleApplicantModalOpen,
  sedeModalIsOpen,
  applicantModalIsOpen,
}) {
  const router = useRouter();
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
  const { isEmpty } = useCurrentUser();
  const { sedes, isLoading: sedesLoading, mutate: sedeMutate } = useSedes(user?.token);
  const { applicants, isLoading: applicantsLoading, mutate } = useApplicants(user?.token);
  
  useEffect(() => {
    if (isEmpty) {
      router.push('/login');
    }

    handleLogged(true);
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
      addressZipcode: data.addressZipcode
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

      await sedeMutate();

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

      await mutate()

      Notification.success({
        title: !isUpdateApplicant ? "Nuevo Solicitante" : "Solicitante Actualizado",
        description: !isUpdateApplicant
          ? "Se ha creado el solicitante exitosamente"
          : "Se ha actualizado el solicitante exitosamente",
        duration: 9000,
        placement: "bottomStart",
      });
    } catch (err) {
      console.error(err);
    }
    handleApplicantLoading(false);
    handleApplicantModalOpen(false);
    handleUpdateApplicant(false);
  };

  if(sedesLoading || applicantsLoading) return <LoadingScreen />

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
              mutate={sedeMutate}
              handleUpdateSede={handleUpdateSede}
              handleSelectedSede={handleSelectedSede}
              items={sedes}
              searchInputValue={searchSedeInputValue}
              handleSedeModalOpen={handleSedeModalOpen}
            />
          ) : (
            <ApplicantsTable
              mutate={mutate}
              searchInputValue={searchApplicantInputValue}
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
      />
      <ApplicantFormModal
        onSubmit={onSubmitUpdateApplicant}
        isOpen={applicantModalIsOpen}
        handleOpen={handleApplicantModalOpen}
        applicantLoading={applicantLoading}
        isUpdateApplicant={isUpdateApplicant}
        selectedApplicant={selectedApplicant}
      />
    </>
  );
}
