import React from "react";
import { useRouter } from "next/router";
import {Icon, IconButton, Notification, Table} from "rsuite";

import { CustomWhisper } from "../common/MenuWrapper";
import CustomDropdownMenu from "../common/CustomDropdownMenu";

import AxiosService from "../../../services/Axios";
import routes from "../../../config/routes";
import { useCurrentUser } from '../../../hooks';

export default function ItemActionCell({
  mutate,
  role,
  tableRef,
  rowData,
  rowKey,
  ...props
}) {
  const { user } = useCurrentUser();
  const router = useRouter();

  const onEdit = () => {
    switch (rowData.type){
      case "medicine":
        router.push({
          pathname: '/items/new-medicine',
          query: {
            id: rowData._id,
            childId: rowData.itemChildId
          }
        });
        break;
      case "meal":
        router.push({
          pathname: '/items/new-meal',
          query: {
            id: rowData._id,
            childId: rowData.itemChildId
          }
        });
        break;
      case "enamelware":
        router.push({
          pathname: '/items/new-enamelware',
          query: {
            id: rowData._id,
            childId: rowData.itemChildId
          }
        });
        break;
      case "electroDevice":
        router.push({
          pathname: '/items/new-electro-device',
          query: {
            id: rowData._id,
            childId: rowData.itemChildId
          }
        });
        break;
      case "stationary":
        router.push({
          pathname: '/items/new-stationary',
          query: {
            id: rowData._id,
            childId: rowData.itemChildId
          }
        });
        break;
      case "property":
        router.push({
          pathname: '/items/new-property',
          query: {
            id: rowData._id,
            childId: rowData.itemChildId
          }
        });
        break;
    }
  }

  const onEnableDisable = async () => {
    try {
      await AxiosService.instance.put(`${routes.items}/${rowData._id}`,
        { disabled: !rowData.disabled }, {
          headers: {
            Authorization: user.token
          }
        })

      await mutate();

      Notification.success({
        title: rowData?.disabled ? "Item habilitado" : "Item deshabilitado",
        description: `Se ha ${
          rowData?.disabled ? "habilitado" : "deshabilitado"
        } el item "${rowData.name}"  con exito`,
        duration: 9000,
        placement: "bottomStart",
      });
    } catch (err) {

    }
  }

  const handleSelectMenu = (eventKey, event) => {
    switch (eventKey) {
      case 1:
        onEdit();
        break;
      case 2:
        onEnableDisable();
        break;
    }
  };

  return (
    <Table.Cell {...props}>
      <CustomWhisper
        tableRef={tableRef}
        menuComponent={<CustomDropdownMenu isNotAdmin={role !== "admin"} withoutEnable={role !== "admin"} rowData={rowData} onSelect={handleSelectMenu} />}
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
