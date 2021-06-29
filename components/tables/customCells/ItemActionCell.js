import React from "react";
import cookiesCutter from "cookie-cutter";
import { useRouter } from "next/router";
import { Icon, IconButton, Table, Notification } from "rsuite";

import { CustomWhisper } from "../common/MenuWrapper";
import CustomDropdownMenu from "../common/CustomDropdownMenu";

import AxiosService from "../../../services/Axios";
import routes from "../../../config/routes";

export default function ItemActionCell({
  tableRef,
  rowData,
  rowKey,
  ...props
}) {
  const router = useRouter();

  const onEdit = () => {
    switch (rowData.type){
      case "medicine":
        router.push({
          pathname: '/items/new-medicine',
          query: {
            id: rowData.itemId,
            childId: rowData._id
          }
        });
        break;
      case "meal":
        router.push({
          pathname: '/items/new-meal',
          query: {
            id: rowData.itemId,
            childId: rowData._id
          }
        });
        break;
      case "enamelware":
        router.push({
          pathname: '/items/new-enamelware',
          query: {
            id: rowData.itemId,
            childId: rowData._id
          }
        });
        break;
      case "electroDevice":
        router.push({
          pathname: '/items/new-electro-device',
          query: {
            id: rowData.itemId,
            childId: rowData._id
          }
        });
        break;
      case "stationary":
        router.push({
          pathname: '/items/new-stationary',
          query: {
            id: rowData.itemId,
            childId: rowData._id
          }
        });
        break;
      case "property":
        router.push({
          pathname: '/items/new-property',
          query: {
            id: rowData.itemId,
            childId: rowData._id
          }
        });
        break;
    }
  }

  const onEnableDisable = async () => {
    try {
      const userCookie = cookiesCutter.get("sialincaUser");
      const user = JSON.parse(userCookie);

      await AxiosService.instance.put(`${routes.items}/${rowData.itemId}`,
        { disabled: !rowData.disabled }, {
          headers: {
            Authorization: user.token
          }
        })

      router.push(router.asPath);
    } catch (err) {

    }
  }

  const handleSelectMenu = (eventKey, event) => {
    switch (eventKey) {
      case 1:
        onEdit()
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
