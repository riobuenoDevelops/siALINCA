import { Dropdown, Icon } from "rsuite";

import "../../styles/custom-header.less";

const ReportsMenu = ({ history, location }) => {
	return (
		<Dropdown
			title="Nuevo Reporte"
			icon={<Icon icon="plus" style={{ color: "white" }} />}
			placement="bottomEnd"
			className="menu-dropdown">
			<Dropdown.Item className="dropdown-item">Anual</Dropdown.Item>
			<Dropdown.Item className="dropdown-item">Mensual</Dropdown.Item>
			<Dropdown.Item className="dropdown-item">Semanal</Dropdown.Item>
			<Dropdown.Item className="dropdown-item">Diario</Dropdown.Item>
		</Dropdown>
	);
};

export default ReportsMenu;
