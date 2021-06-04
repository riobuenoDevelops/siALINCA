import React from "react";
import { Popover, Whisper } from "rsuite";

export const MenuPopover = ({ onSelect, children, ...rest }) => (
  <Popover {...rest} full>
    {children}
  </Popover>
);

export const CustomWhisper = ({
  tableRef,
  children,
  menuComponent,
  menuComponentOnSelect,
}) => {
  let trigger = React.createRef();

  const handleSelectMenu = (eventKey, event) => {
    menuComponentOnSelect(eventKey, event);
    trigger.hide();
  };

  return (
    <Whisper
      placement="autoVerticalEnd"
      trigger="click"
      triggerRef={(ref) => {
        trigger = ref;
      }}
      container={() => {
        return tableRef;
      }}
      speaker={
        <MenuPopover>
          {React.cloneElement(menuComponent, { onSelect: handleSelectMenu })}
        </MenuPopover>
      }
    >
      {children}
    </Whisper>
  );
};
