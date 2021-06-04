import React, { useState } from "react";
import { Dropdown, Icon, IconButton, Popover, Table, Whisper } from "rsuite";
import { useTranslation } from "react-i18next";

const CustomTable = ({
  columns,
  colAlign,
  colFlexGrow,
  columnType,
  items,
  actionMenuOptions,
}) => {
  let tableBody;
  const { Column, HeaderCell, Cell, Pagination } = Table;
  const { i18n } = useTranslation("es");

  const [page, handlePage] = useState(1);
  const [displayLength, handleDisplayLength] = useState(10);
  const [loading, handleLoading] = useState(false);
  const [sortColumn, handleSortColumn] = useState("");
  const [sortType, handleSortType] = useState("");

  const Menu = ({ onSelect }) => (
    <Dropdown.Menu onSelect={onSelect}>
      <Dropdown.Item eventKey={3}>Download As...</Dropdown.Item>
      <Dropdown.Item eventKey={4}>Export PDF</Dropdown.Item>
      <Dropdown.Item eventKey={5}>Export HTML</Dropdown.Item>
      <Dropdown.Item eventKey={6}>Settings</Dropdown.Item>
      <Dropdown.Item eventKey={7}>About</Dropdown.Item>
    </Dropdown.Menu>
  );

  const MenuPopover = ({ onSelect, ...rest }) => (
    <Popover {...rest} full>
      <Menu onSelect={onSelect} />
    </Popover>
  );

  class CustomWhisper extends React.Component {
    constructor(props) {
      super(props);
      this.handleSelectMenu = this.handleSelectMenu.bind(this);
    }
    handleSelectMenu(eventKey, event) {
      console.log(eventKey);
      this.trigger.hide();
    }
    render() {
      return (
        <Whisper
          placement="autoVerticalEnd"
          trigger="click"
          triggerRef={(ref) => {
            this.trigger = ref;
          }}
          container={() => {
            return tableBody;
          }}
          speaker={<MenuPopover onSelect={this.handleSelectMenu} />}
        >
          {this.props.children}
        </Whisper>
      );
    }
  }

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    function handleAction() {
      alert(`id:${rowData[dataKey]}`);
    }
    return (
      <Cell {...props} className="link-group">
        <CustomWhisper>
          <IconButton
            size="sm"
            appearance="subtle"
            icon={<Icon icon="more" />}
          />
        </CustomWhisper>
      </Cell>
    );
  };

  const handleChangePage = (dataKey) => {
    handlePage(dataKey);
  };

  const handleChangeLength = (dataKey) => {
    handleDisplayLength(dataKey);
    handlePage(1);
  };

  const getData = () => {
    const data = items.filter((v, i) => {
      const start = displayLength * (page - 1);
      const end = start + displayLength;
      return i >= start && i < end;
    });

    if (sortColumn && sortType) {
      return data.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === "string") {
          x = x.charCodeAt();
        }
        if (typeof y === "string") {
          y = y.charCodeAt();
        }
        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }

    return data;
  };

  const changeSortColumn = (sortColumn, sortType) => {
    handleLoading(true);

    setTimeout(() => {
      handleSortColumn(sortColumn);
      handleSortType(sortType);
      handleLoading(false);
    }, 500);
  };

  const data = getData();

  return (
    <>
      <Table
        style={{
          borderRadius: "10px",
        }}
        className="shadow"
        autoHeight
        data={data}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={changeSortColumn}
        loading={loading}
        bodyRef={(ref) => {
          tableBody = ref;
        }}
        onRowClick={(data) => {
          console.log(data);
        }}
      >
        {columns.map((colValue, index) => {
          return (
            <Column align={colAlign[index]} flexGrow={colFlexGrow[index]} fixed>
              <HeaderCell>
                <h6 style={{ fontSize: "14px" }}>
                  {colValue !== "" ? i18n.t(`tableHeaders.${colValue}`) : ""}
                </h6>
              </HeaderCell>
              {columnType[index] === "action" ? (
                <ActionCell dataKey={colValue} />
              ) : (
                <Cell dataKey={colValue} style={{ fontSize: "14px" }} />
              )}
            </Column>
          );
        })}
      </Table>
      <Pagination
        lengthMenu={[
          {
            value: 10,
            label: 10,
          },
          {
            value: 20,
            label: 20,
          },

          {
            value: 50,
            label: 50,
          },
        ]}
        activePage={page}
        displayLength={displayLength}
        total={items.length}
        onChangePage={handleChangePage}
        onChangeLength={handleChangeLength}
      />
    </>
  );
};

export default CustomTable;
