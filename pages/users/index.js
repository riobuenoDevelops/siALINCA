import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "../../lib/parseCookies";
import { useTranslation } from "react-i18next";
import routes from "../../config/routes";
import AxiosService from "../../services/Axios";
import UserService from "../../services/User";
import RoleService from "../../services/Role";
import { FlexboxGrid, Notification } from "rsuite";
import FlexboxGridItem from "rsuite/lib/FlexboxGrid/FlexboxGridItem";

import SearchInput from "../../components/Search/SearchInput";
import UserFormModal from "../../components/modals/UserFormModal";
import UsersTable from "../../components/tables/UsersTable";

const UsersPage = ({
                     handleLogged,
                     handleUser,
                     user,
                     userModalIsOpen,
                     handleUserModalOpen,
                     users,
                     roles,
                   }) => {
  const history = useRouter();
  const {i18n} = useTranslation();
  const [userLoading, handleUserLoading] = useState(false);
  const [isUpdateUser, handleUpdateUser] = useState(false);
  const [selectedUser, handleSelectedUser] = useState({});
  const [inputValue, handleInputValue] = useState("");
  const [roleName, handleRoleName] = useState("");
  
  useEffect(() => {
    if (!user) {
      handleLogged(false);
      history.push("/login");
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
  
  return (
    <>
      <FlexboxGrid align="middle">
        <FlexboxGrid.Item colspan={24}>
          <FlexboxGrid align="middle" style={{marginBottom: "2em"}}>
            <FlexboxGridItem colspan={16}>
              <h2 className="text-black text-bolder">
                Usuarios ({i18n.t(`roles.${user?.user?.roleName}`)})
              </h2>
            </FlexboxGridItem>
            <FlexboxGridItem colspan={8}>
              <SearchInput
                placehoderLabel="Usuario"
                value={inputValue}
                handleValue={onHandleInputValue}
              />
            </FlexboxGridItem>
          </FlexboxGrid>
        </FlexboxGrid.Item>
        <FlexboxGridItem colspan={24}>
          <UsersTable
            items={users}
            searchInputValue={inputValue}
            handleSelectedUser={handleSelectedUser}
            handleUpdateUser={handleUpdateUser}
            handleUserModalOpen={handleUserModalOpen}
          />
          {/*<CustomTable
            items={users.filter((user) => {
              return !inputValue
                ? true
                : user.names.toLowerCase().includes(inputValue.toLowerCase()) ||
                    user.lastNames
                      .toLowerCase()
                      .includes(inputValue.toLowerCase()) ||
                    user.email.toLowerCase().includes(inputValue.toLowerCase());
            })}
            columns={["_id", "names", "lastNames", "email", ""]}
            colAlign={["start", "start", "start", "start", "center"]}
            columnType={["string", "string", "string", "string", "action"]}
            colFlexGrow={[2, 2, 2, 2, 1]}
            actionMenuOptions={tableDropdownActionItems}
          />*/}
        </FlexboxGridItem>
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
  let user = null,
    users,
    roles;
  const cookies = parseCookies(req);
  if (cookies && cookies.sialincaUser) {
    try {
      user = JSON.parse(cookies.sialincaUser);
      
      users = await UserService.getUsers({});
      users = users.map(user => ({...user, _id: user._id.toString(), roleId: user.roleId.toString()}));
      
      roles = await RoleService.getRoles();
      roles = roles.map(role => ({...role, _id: role._id.toString()}));
      
      return {
        props: {
          roles: roles || [],
          users: users || [],
          user,
          isError: false,
        },
      };
    } catch (err) {
      return {
        props: {
          user,
          roles: roles || [],
          users: users || [],
          isError: true,
        },
      };
    }
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
