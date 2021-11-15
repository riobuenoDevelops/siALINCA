import React from "react";
import { Dropdown, Icon, IconButton, Table, Notification } from "rsuite";

import routes from "../../../config/routes";
import AxiosService from "../../../services/Axios";

import { CustomWhisper } from "../common/MenuWrapper";
import { useCurrentUser } from '../../../hooks';

const StoreActionCell = ({
  mutate,
  tableRef,
  rowData,
  rowKey,
  handleSelectedStore,
  handleUpdateStore,
  handleModalOpen,
  handleTransferModalOpen,
  handleAddingItems,
  ...props
}) => {
  const { user } = useCurrentUser();

  const onEnableDisableStore = async () => {
    try {

      await AxiosService.instance.put(
        routes.getStores + `/${rowData._id}`,
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
          ? "Almacén habilitado"
          : "Almacén deshabilitado",
        description: `Se ha ${
          rowData?.disabled ? "habilitado" : "deshabilitado"
        } el almacén con exito`,
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
        handleUpdateStore(true);
        handleSelectedStore(rowData);
        handleModalOpen(true);
        break;
      case 2:
        handleSelectedStore(rowData);
        handleTransferModalOpen(true);
        break;
      case 3:
        onEnableDisableStore();
        break;
    }
  };
  const Menu = ({ onSelect }) => (
    <Dropdown.Menu>
      <Dropdown.Item eventKey={1} onSelect={onSelect}>
        <Icon icon="edit" /> Editar
      </Dropdown.Item>
      <Dropdown.Item eventKey={2} onSelect={onSelect}>
        <Icon icon="exchange" /> Transferir items
      </Dropdown.Item>
      <Dropdown.Item divider />
      <Dropdown.Item eventKey={3} onSelect={onSelect}>
        <Icon
          style={{ color: rowData.disabled ? "inherit" : "red" }}
          icon={rowData.disabled ? "circle" : "circle-o"}
        />
        <span style={{ color: rowData.disabled ? "inherit" : "red" }}>
          {rowData.disabled ? "Habilitar" : "Deshabilitar"}
        </span>
      </Dropdown.Item>
    </Dropdown.Menu>
  );

  return (
    <Table.Cell {...props}>
      <CustomWhisper
        tableRef={tableRef}
        menuComponent={<Menu onSelect={handleSelectMenu} />}
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

export default StoreActionCell;
