import React from "react";
import cookiesCutter from "cookie-cutter";
import { useRouter } from "next/router";
import { Icon, IconButton, Table, Notification } from "rsuite";

import { CustomWhisper } from "../common/MenuWrapper";
import CustomDropdownMenu from "../common/CustomDropdownMenu";

import AxiosService from "../../../services/Axios";
import routes from "../../../config/routes";

export default function NoteActionCell({
  mutate,
  tableRef,
  rowData,
  rowKey,
  ...props
}) {
  const router = useRouter();

  const handleSelectMenu = (eventKey, event) => {
    switch (eventKey) {
      case 1:
        console.log(rowData);
        break;
      case 2:
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
