import React from "react";
import { Dropdown, Icon, IconButton, Table, Notification } from "rsuite";
import { CustomWhisper } from "../common/MenuWrapper";
import { useRouter } from "next/router";
import AxiosService from "../../../services/Axios";
import cookiesCutter from "cookie-cutter";
import routes from "../../../config/routes";
import CustomDropdownMenu from "../common/CustomDropdownMenu";

const ApplicantActionCell = ({
  mutate,
  tableRef,
  rowData,
  rowKey,
  handleApplicantModalOpen,
  handleSelectedApplicant,
  handleUpdateApplicant,
  ...props
}) => {
  
  const onEnableDisableApplicant = async () => {
    try {
      const userCookie = cookiesCutter.get("sialincaUser");
      const user = JSON.parse(userCookie);

      await AxiosService.instance.put(
        routes.applicants + `/${rowData._id}`,
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
        title: rowData?.disabled ? "Solicitante habilitado" : "Solicitante deshabilitado",
        description: `Se ha ${
          rowData?.disabled ? "habilitado" : "deshabilitado"
        } el solicitante  con exito`,
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
        handleUpdateApplicant(true);
        handleSelectedApplicant(rowData);
        handleApplicantModalOpen(true);
        break;
      case 2:
        onEnableDisableApplicant();
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

export default ApplicantActionCell;
