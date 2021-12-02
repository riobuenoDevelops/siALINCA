const PdfPrinter = require("pdfmake/src/printer");
const fs = require("fs");
const path = require('path');

class PdfService {
  static fonts = {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique'
    }
  };
  static printer = new PdfPrinter(this.fonts);

  static formatDate(date) {
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  }

  static formatTime(date) {
    return `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  }

  static insertIntoTable(table, data, index = 4, withoutNumber = false, check = 0) {
    const number = [1];
    data.forEach((value) => {
      if (check === 6){
        let chain = value[3].shift();
        if (value[3].length !== 0){
          const cantidad = value[3].length;
          for (let i = 0; i < cantidad; i++)
            chain = chain.concat(' - '+value[3].shift());
        }
        value[3] = chain;
        table.content[check].table.body.push(value);
        return;
      }
      if(withoutNumber) {
        table.content[index].table.body.push(value);
      } else {
        const v = [number[0].toString(), ...value];
        table.content[index].table.body.push(v);
        number[0]++;
      }
    })
  }

  static createDeliveryNotePDF(info, data, path = ".", docName = "Nota de Entrega") {
    const notaDocument = {
      info: {
        title: `Nota de Entrega - ${this.formatDate(new Date(Date.now()))}`,
        author: info.user
      },

      styles: {
        tablas: {
          fontSize: 9,
          margin: [0, 0, 0, 0]
        },
        firma: {
          margin: [30, 10]
        }
      },

      content: [
        {
          image: 'data:image/png;base64,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'
        },
        {
          text: 'NOTA DE ENTREGA DE SALIDA DE INSUMOS Y/O MATERIALES REQUERIDOS',
          bold: true,
          alignment: 'center',
          margin: [30, 8],
          fontSize: 14
        },
        {
          text: 'LUGAR O CENTRO DE ATENCION: ' + info.address || "",
          margin: [0, 10, 0, 0],
          fontSize: 10,
          bold: true,
          alignment: 'left'
        },
        {
          columns: [
            {
              text: 'SOLICITANTE: ' + info.applicant,
              fontSize: 10,
              bold: true,
              alignment: 'left'
            },
            {
              text: 'CEDULA: ' + info.cedula || "",
              fontSize: 10,
              bold: true,
              alignment: 'center'
            },
            {
              text: 'FECHA DE SALIDA: ' + this.formatDate(info.createStamp),
              fontSize: 10,
              bold: true,
              alignment: 'right'
            },
            {
              text: `FECHA DE ENTREGA: ${info.returnStamp !== undefined ? this.formatDate(info.returnStamp) : "Sin Retorno"}`,
              fontSize: 10,
              bold: true,
              alignment: 'right'
            }
          ],
          margin: [0, 6, 0, 10],
          alignment: 'center'
        },
        {
          style: 'tablas',
          table: {
            widths: [25, "auto", 245, '*', '*'],
            body: [
              [
                {text: 'N°', rowSpan: 1, alignment: 'center', bold: true},
                {text: 'Tipo', rowSpan: 1, alignment: 'center', bold: true},
                {text: 'Descripcion del Material', rowSpan: 1, alignment: 'center', bold: true},
                {text: 'Retirados', rowSpan: 1, alignment: 'center', bold: true},
                {text: 'Devueltos', rowSpan: 1, alignment: 'center', bold: true},
              ]
            ]
          }
        },
        {
          style: 'firma',
          table: {
            widths: [100, 100, 100, 100],
            body: [
              [
                {text: 'SALIDA', colSpan: 2, alignment: 'center', bold: true, fontSize: 10, fillColor: '#cccccc'},
                '',
                {text: 'ENTRADA', colSpan: 2, alignment: 'center', bold: true, fontSize: 10, fillColor: '#cccccc'},
                ''
              ],
              [
                {
                  text: 'ENTREGADO POR\n\n\n\n______________________\nNombre y Apellido\n\n\n\n______________________\nFirma',
                  alignment: 'center', bold: true, fontSize: 8
                },
                {
                  text: 'RECIBIDO POR\n\n\n\n______________________\nNombre y Apellido\n\n\n\n______________________\nFirma',
                  alignment: 'center', bold: true, fontSize: 8
                },
                {
                  text: 'ENTREGADO POR\n\n\n\n______________________\nNombre y Apellido\n\n\n\n______________________\nFirma',
                  alignment: 'center', bold: true, fontSize: 8
                },
                {
                  text: 'RECIBIDO POR\n\n\n\n______________________\nNombre y Apellido\n\n\n\n______________________\nFirma',
                  alignment: 'center', bold: true, fontSize: 8
                }
              ]
            ]
          }
        }
      ],
      defaultStyle: {
        font: 'Helvetica'
      }
/*
      defaultStyle: {
        font: 'Epilogue'
      }*/
    }

    this.insertIntoTable(notaDocument, data);

    let pdfDoc = this.printer.createPdfKitDocument(notaDocument);
    pdfDoc.pipe(fs.createWriteStream(`${path}/${docName} - ${this.formatDate(new Date(Date.now()))} ${this.formatTime(new Date(Date.now()))}.pdf`));
    pdfDoc.end();
  }

  static createInventoryPDF(data, path = ".") {

    let inventarioDocument = {
      info:{
        title: 'Inventario al ' + this.formatDate(new Date(Date.now()))
      },

      styles:{
        tablas:{
          fontSize: 9,
          margin: [0,0,0,0]
        }
      },

      content:[
        {
          image: 'data:image/png;base64,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'
        },
        {
          text: 'INVENTARIO',
          bold: true,
          alignment: 'center',
          margin: [0,2,0,4]
        },
        {
          text: `FECHA: ${this.formatDate(new Date(Date.now()))}`,
          bold: true,
          alignment: 'right',
          margin: [0,0,18,10],
          fontSize: 9
        },
        {
          style: 'tablas',
          table:{
            widths:['auto', '*', 'auto', 'auto'],
            body:[
              [
                {text: 'Tipo', alignment: 'center', bold: true, margin: [0,4]},
                {text: 'Descripcion del Material', alignment: 'center', bold: true, margin:[0,4]},
                {text: 'Cantidad', alignment: 'center', bold: true, margin:[0,4]},
                {text: 'Fecha de Vencimiento', alignment: 'center', bold: true, margin:[0,4]}
              ]
            ]
          }
        }
      ],

      defaultStyle: {
        font: "Helvetica"
      }
    }
    this.insertIntoTable(inventarioDocument, data, 3, true);

    let pdfDoc = this.printer.createPdfKitDocument(inventarioDocument);
    pdfDoc.pipe(fs.createWriteStream(`${path}/Inventario al ${this.formatDate(new Date(Date.now()))} ${this.formatTime(new Date(Date.now()))}.pdf`));
    pdfDoc.end();
  }

  static createReportPDF(info, data, path, docName) {
    let reporteDocument = {

      info:{
        title: `Reporte al ${this.formatDate(new Date(Date.now()))} ${this.formatTime(new Date(Date.now()))}`,
        author: info.user
      },

      styles:{
        tablas:{
          fontSize: 9,
          margin: [0,0,0,12]
        }
      },

      content: [
        {
          image: 'data:image/png;base64,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'
        },
        {
          text: 'Reporte ' + info.reportType,
          alignment: 'center',
          bold: 'true',
          margin: [0,8,0,0]
        },
        {
          text: info.startDate + ' - ' + info.endDate,
          alignment: 'center',
          bold: 'true',
          margin: [0,1,0,15]
        },
        {
          columns:[
            {
              text: [
                {text: 'Reporte Generado por: ', bold: true},
                info.user
              ],
              fontSize: 10,
              width: '70%',
              alignment: 'left'
            },
            {
              text: [
                {text: 'Fecha Generado: ', bold: true},
                new Intl.DateTimeFormat('es',{month:'2-digit',day:'2-digit', year:'numeric'}).format(new Date(Date.now()))
              ],
              fontSize: 10,
              width: '30%',
              alignment: 'right'
            }
          ]
        },
        {
          fontSize: 10,
          ul: [
            {
              text: 'Items Agregados\n ',
              bold: true
            }
          ]
        },
        {//6
          style: 'tablas',
          table: {
            widths: [54,120,40,170,75],
            body: [
              [
                {
                  text: 'Codigo', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,2]
                },
                {
                  text: 'Nombre', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,2]
                },
                {
                  text: 'Cantidad', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,2]
                },
                {
                  text: 'Ubicacion en Almacenes', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,2]
                },
                {
                  text: 'Fecha Agregado', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,2]
                }
              ],
            ]
          }
        },
        {
          fontSize: 10,
          bold: true,
          ul: [
            'Almacenes\n '
          ]
        },
        {//8
          style: 'tablas',
          margin: [10,0,0,12],
          table: {
            widths: [54,120,140,50,75],
            body: [
              [
                {
                  text: 'Codigo', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,2]
                },
                {
                  text: 'Nombre', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,2]
                },
                {
                  text: 'Item Agregado', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,2]
                },
                {
                  text: 'Cantidad', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,2]
                },
                {
                  text: 'Fecha Agregado', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,2]
                }
              ]
            ]
          }
        },
        {
          fontSize: 10,
          bold: true,
          ul: [
            'Notas de Entrega sin Retorno\n '
          ]
        },
        {//10
          style: 'tablas',
          margin: [10,0,0,12],
          table: {
            widths: [54,120,120,70,75],
            body: [
              [
                {
                  text: 'Codigo', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,5]
                },
                {
                  text: 'Responsable', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,5]
                },
                {
                  text: 'Despachado Por', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,5]
                },
                {
                  text: 'Cant.\n Items Pedidos', alignment: 'center', bold: true, fillColor: '#cccccc'
                },
                {
                  text: 'Fecha Realizado', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,5]
                }
              ]
            ]
          }
        },
        {
          fontSize: 10,
          bold: true,
          ul: [
            'Notas de Entrega con Retorno\n '
          ]
        },
        {//12
          style: 'tablas',
          table: {
            widths: [54,120,120,70,'auto','auto'],
            body: [
              [
                {
                  text: 'Codigo', rowSpan: 2, alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,11]
                },
                {
                  text: 'Responsable', rowSpan: 2, alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,11]
                },
                {
                  text: 'Despachado Por', rowSpan: 2, alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,11]
                },
                {
                  text: 'Cant.\n Items Pedidos', rowSpan: 2, alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,6]
                },
                {
                  text: 'Fecha', colSpan: 2, alignment: 'center', bold: true, fillColor: '#cccccc', margin: [0,2]
                },
                ''
              ],
              [
                '',
                '',
                '',
                '',
                {
                  text: 'Entrega', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [3,2]
                },
                {
                  text: 'Retorno', alignment: 'center', bold: true, fillColor: '#cccccc', margin: [3,2]
                }
              ]
            ]
          }
        },
      ],

      defaultStyle: {
        font: 'Epilogue'
      }
    }

    this.insertIntoTable(reporteDocument, data.addedItems, 6, true, 6);
    this.insertIntoTable(reporteDocument, data.stores, 8, true);
    this.insertIntoTable(reporteDocument, data.notesWithReturn, 10, true);
    this.insertIntoTable(reporteDocument, data.notesWithoutReturn, 12, true);

    let pdfDoc = this.printer.createPdfKitDocument(reporteDocument);
    pdfDoc.pipe(fs.createWriteStream(`${path}/${docName}.pdf`));
    pdfDoc.end();
  }
}

module.exports = PdfService;
