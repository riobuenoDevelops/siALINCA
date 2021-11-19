import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Notification, Table } from "rsuite";
import electron from "electron";

import NoteActionCell from "./customCells/NoteActionCell";
import DeliveryNoteDetailModal from "../modals/DeliveryNoteDetailModal";

import { useApplicants, useSedes } from "../../hooks";
import AxiosService from "../../services/Axios";
import routes from "../../config/routes";

import "../../styles/custom-theme.less";

const TypeCell = ({ rowData, dataKey, ...props }) => {
  const { t } = useTranslation();

  return (
    <Table.Cell {...props}>
      <span>{t(`notes.${rowData[dataKey]}`)}</span>
    </Table.Cell>
  )
}

const DateCell = ({ rowData, rowKey, dataKey, ...props }) => {
  return (
    <Table.Cell {...props}>
      {rowData[dataKey] && (
        <span>{new Intl.DateTimeFormat('es', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        }).format(new Date(rowData[dataKey]))}</span>
      )}
    </Table.Cell>
  )
}

const ApplicantCell = ({ rowData, rowKey, applicantData, ...props }) => {
  const actualCellData = applicantData.filter(applicant => applicant._id === rowData["applicantId"])[0];

  return (
    <Table.Cell {...props}>
      {rowData.applicantType === "applicant"
        ? <span
          style={{ textDecoration: rowData.deleted ? "line-through" : "unset" }}>{`${actualCellData?.names} ${actualCellData?.lastNames}`}</span>
        : <span style={{ textDecoration: rowData.deleted ? "line-through" : "unset" }}>{actualCellData?.name}</span>
      }
    </Table.Cell>
  )
}

const ipcRenderer = electron.ipcRenderer || false;

export default function NotesTable({ notes, token, readOnly, withoutResponsable, mutate, stores, items }) {
  let tableBody;
  const { applicants = [] } = useApplicants(token);
  const { sedes = [] } = useSedes(token);
  const { Column, Cell, HeaderCell, Pagination } = Table;
  const [page, handlePage] = useState(1);
  const [displayLength, handleDisplayLength] = useState(10);
  const [isOpen, handleOpen] = useState(false);
  const [selectedData, handleData] = useState({});

  useEffect(() => {
    ipcRenderer.once("deliveryNoteOutside", async function (event, eventData) {
      onGeneratePDF(eventData);
    });
  }, [selectedData]);

  const onGeneratePDF = async (path) => {
    try {
      await AxiosService.instance.post(`${routes.notes}/${selectedData._id}/pdf`, {
        path
      }, {
        headers: {
          Authorization: token
        }
      });

      Notification.success({
        title: "Se ha generado el PDF correctamente",
        description: `El PDF se ha generado en ${path}`,
        placement: "topStart",
        duration: 5000
      });

    } catch (err) {
      Notification.error({
        title: "Ha ocurrido un error generando el archivo PDF",
        placement: "bottomStart",
        duration: 5000
      });
      console.log(err);
    }
  }

  const handleChangePage = (dataKey) => {
    handlePage(dataKey);
  };

  const handleChangeLength = (dataKey) => {
    handleDisplayLength(dataKey);
    handlePage(1);
  };

  const getData = () => {
    const data = notes.filter((v, i) => {
      const start = displayLength * (page - 1);
      const end = start + displayLength;
      return i >= start && i < end;
    });

    return data;
  };

  const data = getData();

  return (
    <>
      <Table
        wordWrap
        autoHeight
        data={data}
        headerHeight={50}
        rowHeight={60}
        className="header-table shadow"
        bodyRef={(ref) => {
          tableBody = ref;
        }}
        onRowClick={(row, event) => {
          if (event.target.className === "rs-table-cell-wrap") {
            handleData(row);
            handleOpen(true);
          }
        }}
      >
        <Column
          verticalAlign="middle"
          flexGrow={2}
        >
          <HeaderCell>
            <h6 className="text-black text-bold">Código</h6>
          </HeaderCell>
          <Cell dataKey="_id"/>
        </Column>
        {!withoutResponsable && (
          <Column verticalAlign="middle" flexGrow={2}>
            <HeaderCell>
              <h6 className="text-black text-bold">Responsable</h6>
            </HeaderCell>
            <ApplicantCell applicantData={[...applicants, ...sedes]}/>
          </Column>
        )}
        <Column verticalAlign="middle" flexGrow={1}>
          <HeaderCell>
            <h6 className="text-black text-bold">Tipo de Nota</h6>
          </HeaderCell>
          <TypeCell dataKey="noteType"/>
        </Column>
        <Column verticalAlign="middle" flexGrow={1}>
          <HeaderCell>
            <h6 className="text-black text-bold">F. Salida</h6>
          </HeaderCell>
          <DateCell dataKey="createStamp"/>
        </Column>
        <Column verticalAlign="middle" flexGrow={1}>
          <HeaderCell>
            <h6 className="text-black text-bold">F. Devolución</h6>
          </HeaderCell>
          <DateCell dataKey="returnStamp"/>
        </Column>
        {!readOnly &&
        <Column
          verticalAlign="middle"
          flexGrow={1}
          align="right"
        >
          <HeaderCell>{""}</HeaderCell>
          <NoteActionCell mutate={mutate} handleSelectedData={handleData} />
        </Column>
        }
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
        total={notes.length}
        onChangePage={handleChangePage}
        onChangeLength={handleChangeLength}
      />
      <DeliveryNoteDetailModal
        token={token}
        applicants={[...applicants, ...sedes]}
        onHide={() => handleOpen(false)}
        isOpen={isOpen}
        noteData={selectedData}
        stores={stores}
        items={items}
      />
    </>
  );
};
