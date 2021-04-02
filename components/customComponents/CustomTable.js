import React, { useState } from "react";
import { Table } from "rsuite";
import { useTranslation } from "react-i18next";

const CustomTable = ({ columns, colAlign, colFlexGrow, columnType, items }) => {
	const { Column, HeaderCell, Cell, Pagination } = Table;
	const { t, i18n } = useTranslation("es");

	const [page, handlePage] = useState(1);
	const [displayLength, handleDisplayLength] = useState(10);
	const [loading, handleLoading] = useState(false);
	const [sortColumn, handleSortColumn] = useState("");
	const [sortType, handleSortType] = useState("");

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
				style={{ borderRadius: "15px" }}
				autoHeight
				data={data}
				sortColumn={sortColumn}
				sortType={sortType}
				onSortColumn={changeSortColumn}
				loading={loading}
				onRowClick={(data) => {
					console.log(data);
				}}>
				{columns.map((colValue, index) => {
					return (
						<Column align={colAlign[index]} flexGrow={colFlexGrow[index]} fixed>
							<HeaderCell>
								<h6 style={{ fontSize: "14px" }}>{t(colValue)}</h6>
							</HeaderCell>
							<Cell dataKey={colValue} style={{ fontSize: "14px" }} />
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
