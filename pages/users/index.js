import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { FlexboxGrid, Notification } from "rsuite";

import SearchInput from "../../components/Search/SearchInput";
import UserFormModal from "../../components/modals/UserFormModal";
import UsersTable from "../../components/tables/UsersTable";

import routes from "../../config/routes";
import { parseCookies } from "../../lib/parseCookies";
import AxiosService from "../../services/Axios";

import { useUsers, useRoles } from "../../hooks";
import LoadingScreen from "../../components/layouts/LoadingScreen";

const UsersPage = ({
  handleLogged,
  handleUser,
  user,
  userModalIsOpen,
  handleUserModalOpen,
}) => {
  const history = useRouter();
  const { i18n } = useTranslation();
  const [userLoading, handleUserLoading] = useState(false);
  const [isUpdateUser, handleUpdateUser] = useState(false);
  const [selectedUser, handleSelectedUser] = useState({});
  const [inputValue, handleInputValue] = useState("");
  const [roleName, handleRoleName] = useState("");
  const { users, isLoading: usersLoading } = useUsers(user.token);
  const { roles, isLoading: rolesLoading } = useRoles(user.token);
  
  useEffect(() => {
    if (!user) {
      handleLogged(false);
    } else {
      handleLogged(true);
      handleUser(user);
    }
  }, []);
  
  const onHandleInputValue = (value) => {
    handleInputValue(value);
  };
  
  const onSubmitUpdateUser = async (data) => {
    handleUserLoading(true);
    
    const userData = {
      email: data.email,
      names: data.names,
      lastNames: data.lastNames,
      password: data.password,
      roleName: data.roleName,
    };
    
    try {
      if (!isUpdateUser) {
        await AxiosService.instance.post(routes.newUser, userData, {
          headers: {
            Authorization: user.token,
          },
        });
      } else {
        await AxiosService.instance.put(
          routes.updateUser + `/${selectedUser._id}`,
          userData,
          {
            headers: {
              Authorization: user.token,
            },
          }
        );
        handleUpdateUser(false);
      }
      handleUserLoading(false);
      handleUserModalOpen(false);
      Notification.success({
        title: !isUpdateUser ? "Nuevo usuario" : "Usuario Actualizado",
        description: !isUpdateUser
          ? "Se ha creado el usuario exitosamente"
          : "Se ha actualizado el usuario exitosamente",
        duration: 9000,
        placement: "bottomStart",
      });
      history.replace(history.asPath);
    } catch (err) {
      console.log(err);
    }
  };

  if(usersLoading || rolesLoading) return <LoadingScreen />

  return (
    <>
      <FlexboxGrid align="middle">
        <FlexboxGrid.Item colspan={24}>
          <FlexboxGrid align="middle" style={{marginBottom: "2em"}}>
            <FlexboxGrid.Item colspan={16}>
              <h2 className="text-black text-bolder">
                Usuarios ({i18n.t(`roles.${user?.user?.roleName}`)})
              </h2>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={8}>
              <SearchInput
                placehoderLabel="Usuario"
                value={inputValue}
                handleValue={onHandleInputValue}
              />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <UsersTable
            items={users}
            searchInputValue={inputValue}
            handleSelectedUser={handleSelectedUser}
            handleUpdateUser={handleUpdateUser}
            handleUserModalOpen={handleUserModalOpen}
          />
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <UserFormModal
        onSubmit={onSubmitUpdateUser}
        handleOpen={handleUserModalOpen}
        isOpen={userModalIsOpen}
        newUserLoading={userLoading}
        roles={roles}
        roleName={roleName}
        handleRoleName={handleRoleName}
        isUpdateUser={isUpdateUser}
        selectedUser={selectedUser}
      />
    </>
  );
};

export async function getServerSideProps({req, res}) {
  let user = null;
  const cookies = parseCookies(req);
  if (cookies && cookies.sialincaUser) {
    user = JSON.parse(cookies.sialincaUser);

    return {
      props: {
        user,
        isError: false,
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: "/login"
    },
    props: {},
  };
}

export default UsersPage;
