import { Input, Icon, InputGroup } from "rsuite";

const SearchInput = ({ placehoderLabel }) => {
	return (
		<InputGroup inside>
			<InputGroup.Addon className="addon">
				<Icon icon="search" style={{ color: "#a8a8a8" }} />
			</InputGroup.Addon>
			<Input
				className="with-addon-p"
				placeholder={`Buscar ${placehoderLabel}`}
			/>
		</InputGroup>
	);
};

export default SearchInput;
