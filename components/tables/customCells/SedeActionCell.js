import React from "react";
import cookiesCutter from "cookie-cutter";
import { useRouter } from "next/router";
import { Icon, IconButton, Table, Notification } from "rsuite";

import { CustomWhisper } from "../common/MenuWrapper";
import CustomDropdownMenu from "../common/CustomDropdownMenu";

import AxiosService from "../../../services/Axios";
import routes from "../../../config/routes";

const SedeActionCell = ({
  mutate,
  tableRef,
  rowData,
  rowKey,
  handleSelectedSede,
  handleUpdateSede,
  handleModalOpen,
  handleSedeDepartments,
  ...props
}) => {

  const onEnableDisableSede = async () => {
    try {
      const userCookie = cookiesCutter.get("sialincaUser");
      const user = JSON.parse(userCookie);

      await AxiosService.instance.put(
        routes.sedes + `/${rowData._id}`,
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
        title: rowData?.disabled ? "Sede habilitada" : "Sede deshabilitada",
        description: `Se ha ${
          rowData?.disabled ? "habilitado" : "deshabilitado"
        } la sede  con exito`,
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
        console.log(rowData);
        handleUpdateSede(true);
        handleSelectedSede(rowData);
        handleSedeDepartments(
          rowData.departments.map((depto, index) => {
            return { department: depto, index };
          })
        );
        handleModalOpen(true);
        break;
      case 2:
        onEnableDisableSede();
        break;
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

export default SedeActionCell;
