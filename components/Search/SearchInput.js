import { Input, Icon, InputGroup, AutoComplete } from "rsuite";

const SearchInput = ({ placehoderLabel, value, handleValue, data }) => {
  const onHandleValue = (value) => {
    handleValue(value);
  };

  return (
    <InputGroup inside>
      <AutoComplete
        data={data}
        className="with-addon-p"
        placeholder={`Buscar ${placehoderLabel}`}
        value={value}
        onChange={onHandleValue}
      />
      <InputGroup.Addon className="addon">
        <Icon icon="search" style={{ color: "#a8a8a8" }} />
      </InputGroup.Addon>
    </InputGroup>
  );
};

export default SearchInput;
