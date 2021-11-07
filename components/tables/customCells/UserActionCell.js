import React from "react";
import { Icon, IconButton, Table, Notification } from "rsuite";
import { useRouter } from "next/router";
import cookiesCutter from "cookie-cutter";

import { CustomWhisper } from "../common/MenuWrapper";
import CustomDropdownMenu from "../common/CustomDropdownMenu";

import AxiosService from "../../../services/Axios";
import routes from "../../../config/routes";

const UserActionCell = ({
  mutate,
  tableRef,
  rowData,
  rowKey,
  handleSelectedUser,
  handleUpdateUser,
  handleModalOpen,
  ...props
}) => {

  const onDeleteUser = async () => {
    try {
      const userCookie = cookiesCutter.get("sialincaUser");
      const user = JSON.parse(userCookie);

      await AxiosService.instance.delete(
        routes.updateUser + `/${rowData._id}`,
        {
          headers: {
            Authorization: user.token,
          },
        }
      );
      await mutate();

      Notification.success({
        title: "Usuario Eliminado",
        description: `Se ha eliminado el Usuario ${rowData.names} ${rowData.lastNames}`,
        duration: 9000,
        placement: "bottomStart",
      });

    } catch (err) {
      console.error(err);
    }
  }

  const onEnableDisableUser = async () => {
    try {
      const userCookie = cookiesCutter.get("sialincaUser");
      const user = JSON.parse(userCookie);

      await AxiosService.instance.put(
        routes.updateUser + `/${rowData._id}`,
        {
          disabled: !rowData.disabled,
        },
        {
          headers: {
            Authorization: user.token,
          },
        }
      );
      await mutate();

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
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectMenu = (eventKey, event) => {
    switch (eventKey) {
      case 1:
        handleUpdateUser(true);
        handleSelectedUser(rowData);
        handleModalOpen(true);
        break;
      case 2:
        onEnableDisableUser();
        break;
      case 3:
        onDeleteUser();
        break;
    }
  };

  return (
    <Table.Cell {...props}>
      <CustomWhisper
        tableRef={tableRef}
        menuComponent={<CustomDropdownMenu rowData={rowData} onSelect={handleSelectMenu} hasDeleted={!rowData.isDeleted} />}
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
