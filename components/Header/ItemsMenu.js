import { Dropdown, Icon } from "rsuite";

import "../../styles/custom-header.less";

const ItemsMenu = ({ history, location }) => {
	return (
		<Dropdown
			title="Nuevo Insumo"
			icon={<Icon icon="plus" style={{ color: "white" }} />}
			placement="bottomStart"
			className="menu-dropdown no-full-width">
			<Dropdown.Item className="dropdown-item">
				<Icon icon="medkit" /> Medicamento
			</Dropdown.Item>
			<Dropdown.Item className="dropdown-item">
				<Icon icon="cutlery" /> Alimento
			</Dropdown.Item>
			<Dropdown.Item className="dropdown-item">
				<Icon icon="home" /> Inmueble
			</Dropdown.Item>
			<Dropdown.Item className="dropdown-item">
				<Icon icon="tv" /> Equipo Electrónico
			</Dropdown.Item>
		</Dropdown>
	);
};

export default ItemsMenu;
