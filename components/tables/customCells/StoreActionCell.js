import React from "react";
import { Dropdown, Icon, IconButton, Table, Notification } from "rsuite";
import { CustomWhisper } from "../common/MenuWrapper";
import { useRouter } from "next/router";
import AxiosService from "../../../services/Axios";
import cookiesCutter from "cookie-cutter";
import routes from "../../../config/routes";

const StoreActionCell = ({
  tableRef,
  rowData,
  rowKey,
  handleSelectedStore,
  handleUpdateStore,
  handleModalOpen,
  handleAddingItems,
  ...props
}) => {
  const router = useRouter();

  const onChangeStore = async () => {
    const userCookie = cookiesCutter.get("sialincaUser");
    try {
      const user = JSON.parse(userCookie);

      if (rowData?.disabled) {
        await AxiosService.instance.put(
          routes.getStores + `/${rowData._id}`,
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
          routes.getStores + `/${rowData._id}`,
          {
            headers: {
              Authorization: user.token,
            },
          }
        );
      }

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
      router.replace(router.asPath);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectMenu = (eventKey, event) => {
    console.log(eventKey);
    switch (eventKey) {
      case 1:
        handleUpdateStore(true);
        handleSelectedStore(rowData);
        handleModalOpen(true);
        break;
      case 2:
        handleSelectedStore(rowData);
        handleAddingItems(true);
        break;
      case 3:
        onChangeStore();
        break;
    }
  };
  const Menu = ({ onSelect }) => (
    <Dropdown.Menu>
      <Dropdown.Item eventKey={1} onSelect={onSelect}>
        <Icon icon="edit" /> Editar
      </Dropdown.Item>
      <Dropdown.Item eventKey={2} onSelect={onSelect}>
        <Icon icon="cubes" /> Agregar items
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
