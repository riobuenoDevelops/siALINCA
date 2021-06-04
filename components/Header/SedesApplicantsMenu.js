import { Dropdown, Icon } from "rsuite";

import "../../styles/custom-header.less";

const SedesApplicantsMenu = ({
  handleOpenSedeModal,
  handleOpenApplicantModal,
}) => {
  const onSelect = (eventKey) => {
    switch (eventKey) {
      case 1:
        handleOpenSedeModal();
        break;
      case 2:
        handleOpenApplicantModal();
        break;
    }
  };

  return (
    <Dropdown
      title="Nuevo"
      icon={<Icon icon="plus" style={{ color: "white" }} />}
      placement="bottomEnd"
      className="menu-dropdown"
    >
      <Dropdown.Item eventKey={1} className="dropdown-item" onSelect={onSelect}>
        <Icon icon="home" /> Sede
      </Dropdown.Item>
      <Dropdown.Item eventKey={2} className="dropdown-item" onSelect={onSelect}>
        <Icon icon="user" /> Aplicante
      </Dropdown.Item>
    </Dropdown>
  );
};

export default SedesApplicantsMenu;
