import { Dropdown, Icon, IconButton, Table } from "rsuite";

import "../../styles/custom-header.less";

const CustomTableActionMenu = ({
  dropdownIcon,
  iconColor,
  dropDownChildren,
  rowData,
  dataKey,
  ...props
}) => {
  const { Cell } = Table;

  const handleAction = () => {
    alert(`id:${rowData[dataKey]}`);
  };

  return (
    <Cell {...props}>
      <Dropdown
        renderTitle={() => {
          return (
            <IconButton
              appearance="default"
              icon={<Icon icon={dropdownIcon} style={{ color: iconColor }} />}
            />
          );
        }}
        placement="bottomStart"
        className="menu-dropdown no-full-width"
      >
        {dropDownChildren.map((child) => {
          return (
            <Dropdown.Item className="dropdown-item" onSelect={handleAction}>
              <Icon icon={child.icon} /> {child.name}
            </Dropdown.Item>
          );
        })}
      </Dropdown>
    </Cell>
  );
};

export default CustomTableActionMenu;
