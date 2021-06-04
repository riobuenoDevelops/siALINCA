import React from "react";
import { Dropdown, Icon, IconButton, Table, Notification } from "rsuite";
import { CustomWhisper } from "../common/MenuWrapper";
import { useRouter } from "next/router";
import AxiosService from "../../../services/Axios";
import cookiesCutter from "cookie-cutter";
import routes from "../../../config/routes";
import CustomDropdownMenu from "../common/CustomDropdownMenu";

const SedeActionCell = ({
  tableRef,
  rowData,
  rowKey,
  handleSelectedSede,
  handleUpdateSede,
  handleModalOpen,
  handleSedeDepartments,
  ...props
}) => {
  const router = useRouter();

  const onChangeSede = async () => {
    try {
      const userCookie = cookiesCutter.get("sialincaUser");
      const user = JSON.parse(userCookie);

      if (rowData?.disabled) {
        await AxiosService.instance.put(
          routes.sedes + `/${rowData._id}`,
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
        await AxiosService.instance.delete(routes.sedes + `/${rowData._id}`, {
          headers: {
            Authorization: user.token,
          },
        });
      }

      Notification.success({
        title: rowData?.disabled ? "Sede habilitada" : "Sede deshabilitada",
        description: `Se ha ${
          rowData?.disabled ? "habilitado" : "deshabilitado"
        } la sede  con exito`,
        duration: 9000,
        placement: "bottomStart",
      });
      router.replace(router.asPath);
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
        onChangeSede();
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
