import { Input, Icon, InputGroup } from "rsuite";

const SearchInput = ({ placehoderLabel, value, handleValue }) => {

  return (
    <InputGroup inside>
      <Input
        size="lg"
        placeholder={`Buscar ${placehoderLabel}`}
        value={value}
        onChange={handleValue}
      />
      <InputGroup.Addon className="addon">
        <Icon icon="search" style={{ color: "#a8a8a8" }} />
      </InputGroup.Addon>
    </InputGroup>
  );
};

export default SearchInput;
