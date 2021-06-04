import React from "react";
import { Dropdown, Icon, IconButton, Table, Notification } from "rsuite";
import { CustomWhisper } from "../common/MenuWrapper";
import { useRouter } from "next/router";
import AxiosService from "../../../services/Axios";
import cookiesCutter from "cookie-cutter";
import routes from "../../../config/routes";
import CustomDropdownMenu from "../common/CustomDropdownMenu";

const UserActionCell = ({
  tableRef,
  rowData,
  rowKey,
  handleSelectedUser,
  handleUpdateUser,
  handleModalOpen,
  ...props
}) => {
  const router = useRouter();

  const onChangeUser = async () => {
    try {
      const userCookie = cookiesCutter.get("sialincaUser");
      const user = JSON.parse(userCookie);

      if (rowData?.disabled) {
        await AxiosService.instance.put(
          routes.updateUser + `/${rowData._id}`,
          {
            disabled: false,
          },
          {
            headers: {
              Authorization: user.token,
            },
          }
        );
      } else {
        await AxiosService.instance.delete(
          routes.updateUser + `/${rowData._id}`,
          {
            headers: {
              Authorization: user.token,
            },
          }
        );
      }

      Notification.success({
        title: rowData?.disabled
          ? "Usuario habilitado"
          : "Usuario deshabilitado",
        description: `Se ha ${
          rowData?.disabled ? "habilitado" : "deshabilitado"
        } el usuario con exito`,
        duration: 9000,
        placement: "bottomStart",
      });
      router.replace(router.asPath);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectMenu = (eventKey, event) => {
    console.log(eventKey);
    switch (eventKey) {
      case 1:
        handleUpdateUser(true);
        console.log("editMenu", rowData);
        handleSelectedUser(rowData);
        handleModalOpen(true);
        break;
      case 2:
        onChangeUser();
        break;
      default:
        console.log("si pasa por aqui");
    }
  };

  return (
    <Table.Cell {...props}>
      <CustomWhisper
        tableRef={tableRef}
        menuComponent={<CustomDropdownMenu rowData={rowData} onSelect={handleSelectMenu} />}
        menuComponentOnSelect={handleSelectMenu}
      >
        <IconButton
          circle
          appearance="default"
          className="bg-color-white"
          icon={<Icon icon="more" />}
        />
      </CustomWhisper>
    </Table.Cell>
  );
};

export default UserActionCell;
