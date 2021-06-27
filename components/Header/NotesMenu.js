import { Dropdown, Icon } from "rsuite";

import "../../styles/custom-header.less";

const NotesMenu = ({ router }) => {
	const onSelect = (eventKey) => {
		switch (eventKey) {
			case "1":
				router.push({
					pathname: `${router.pathname}/new-delivery-note`,
					query: { type: "CR" }
				});
				break;
			case "2":
				router.push({
					pathname: `${router.pathname}/new-delivery-note`,
					query: { type: "SR" }
				});
				break;
		}
	}

	return (
		<Dropdown
			title="Nueva Orden"
			icon={<Icon icon="plus" style={{ color: "white" }} />}
			placement="bottomEnd"
			className="menu-dropdown">
			<Dropdown.Item
				className="dropdown-item"
				eventKey="1"
				onSelect={onSelect}
			>
				<Icon icon="level-down" /> Con Retorno
			</Dropdown.Item>
			<Dropdown.Item
				className="dropdown-item"
				eventKey="2"
				onSelect={onSelect}
			>
				<Icon icon="level-up" /> Sin Retorno
			</Dropdown.Item>
		</Dropdown>
	);
};

export default NotesMenu;
