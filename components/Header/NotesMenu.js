import { Dropdown, Icon } from "rsuite";

import "../../styles/custom-header.less";

const NotesMenu = ({ history, location }) => {
	return (
		<Dropdown
			title="Nueva Orden"
			icon={<Icon icon="plus" style={{ color: "white" }} />}
			placement="bottomEnd"
			className="menu-dropdown">
			<Dropdown.Item className="dropdown-item">
				<Icon icon="level-down" /> Con Retorno
			</Dropdown.Item>
			<Dropdown.Item className="dropdown-item">
				<Icon icon="level-up" /> Sin Retorno
			</Dropdown.Item>
		</Dropdown>
	);
};

export default NotesMenu;
