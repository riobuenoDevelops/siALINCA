import { Icon, IconButton, Table } from "rsuite";
import electron from "electron";

import { CustomWhisper } from "../common/MenuWrapper";
import CustomDropdownMenu from "../common/CustomDropdownMenu";


const ipcRenderer = electron.ipcRenderer || false;

export default function NoteActionCell({
  mutate,
  tableRef,
  rowData,
  handleSelectedData,
  rowKey,
  token,
  ...props
}) {

  const onGeneratePDF = () => {
    ipcRenderer.send("openDirDialog", { event: 'deliveryNoteOutside' });
  }

  const handleSelectMenu = (eventKey, event) => {
    switch (eventKey) {
      case 1:

        break;
      case 2:
        break;
      case 4:
        handleSelectedData(rowData);
        onGeneratePDF();
        break;
    }
  };

  return (
    <Table.Cell {...props}>
      <CustomWhisper
        tableRef={tableRef}
        menuComponent={<CustomDropdownMenu withoutEdit withoutEnable hasPDF rowData={rowData} onSelect={handleSelectMenu} hasDeleted  />}
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
