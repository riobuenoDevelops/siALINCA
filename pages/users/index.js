import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { FlexboxGrid, Notification } from "rsuite";

import LoadingScreen from "../../components/layouts/LoadingScreen";
import SearchInput from "../../components/Search/SearchInput";
import UsersTable from "../../components/tables/UsersTable";
import UserFormModal from "../../components/modals/UserFormModal";

import { useUsers, useRoles, useCurrentUser } from "../../hooks";
import routes from "../../config/routes";
import AxiosService from "../../services/Axios";

export default function UsersPage({
  handleLogged,
  user,
  userModalIsOpen,
  handleUserModalOpen,
}) {
  const history = useRouter();
  const { i18n } = useTranslation();
  const [userLoading, handleUserLoading] = useState(false);
  const [isUpdateUser, handleUpdateUser] = useState(false);
  const [selectedUser, handleSelectedUser] = useState({});
  const [inputValue, handleInputValue] = useState("");
  const [roleName, handleRoleName] = useState("");
  const { isEmpty } = useCurrentUser();
  const { users, isLoading: usersLoading, mutate } = useUsers(user?.token);
  
  useEffect(() => {
    if (isEmpty) {
      history.push('/login');
    }

    handleLogged(true);
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

      await mutate();
    } catch (err) {
      console.log(err);
    }
  };

  if(usersLoading) return <LoadingScreen />

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
            items={users.filter(userData => userData.email !== user.user.email)}
            mutate={mutate}
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
        token={user?.token}
        roleName={roleName}
        handleRoleName={handleRoleName}
        isUpdateUser={isUpdateUser}
        selectedUser={selectedUser}
      />
    </>
  );
}
