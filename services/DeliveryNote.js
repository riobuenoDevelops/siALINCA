const MongoLib = require("../lib/db");
const PdfService = require("./Pdf");
const ItemService = require("./Item");
const UserService = require("./User");
const SedeService = require("./Sede");
const ApplicantService = require("./Applicant");

class DeliveryNoteService {
  static MongoDB = new MongoLib();
  static collection = "deliveryNotes";

  static async getDeliveryNotes({
    createStamp,
    returnStamp,
    noteType,
    applicantType,
    applicantId,
    disabled,
    isDeleted,
    createdAt,
    startDate,
    endDate
  }) {
    let query = {
      createStamp,
      returnStamp,
      noteType,
      applicantType,
      applicantId,
      disabled,
      isDeleted,
      createdAt
    };

    Object.keys(query).map((key) => {
      if (query[key] === undefined) {
        delete query[key];
      }
    });

    if(startDate) {
      query = {
        ...query,
        createdAt: {
          "$gte": new Date(startDate),
          "lt": new Date(endDate)
        }
      }
    }

    return (await this.MongoDB.getAll(this.collection, query)) || [];
  }

  static async getDeliveryNote({ id }) {
    const note = this.MongoDB.get(this.collection, id);

    if (!note) {
      throw new Error(`Delivery Note ${id} not found`);
    }

    return note;
  }

  static async getDeliveryNotesByItem({ itemId }){
    const deliveryNotes = await this.getDeliveryNotes({});
    if (!deliveryNotes.length) {
      return [];
    }

    return deliveryNotes.filter(note => (
      note.items.some((item) => ( item.itemId === itemId ))
    ))
  }

  static async getDeliveryNotesByStore({ storeId }){
    const deliveryNotes = await this.getDeliveryNotes({});
    if (!deliveryNotes.length) {
      return [];
    }

    return deliveryNotes.filter(note => (
      note.items.some((item) => ( item.storeId === storeId ))
    ))
  }

  static async getDeliveryNotesBySede({ sede }){
    const deliveryNotes = await this.getDeliveryNotes({ applicantType: "sede" });
    if (!deliveryNotes.length) {
      return [];
    }

    return deliveryNotes.filter(note => (
      note.applicantId === sede
    ))
  }

  static async getDeliveryNotesByApplicant({ applicant }){
    const deliveryNotes = await this.getDeliveryNotes({ applicantType: "applicant" });
    if (!deliveryNotes.length) {
      return [];
    }

    return deliveryNotes.filter(note => (
      note.applicantId === applicant
    ))
  }

  static async createDeliveryNote({ deliveryNote }) {
    console.log(deliveryNote);
    const noteId =  await this.MongoDB.create(this.collection, {
      ...deliveryNote,
      disabled: false,
      isDeleted: false,
      createdAt: new Date(Date.now())
    });

   /* if(deliveryNote.generatePDF) {
      await this.generatePDF({deliveryNote});
    }*/

    return noteId;
  }

  static async generatePDF({ deliveryNote }) {
    const items = await ItemService.getItems({});
    const user = await UserService.getUser({ id: deliveryNote.userId });
    const applicant = deliveryNote.applicantType === "sede" ? await SedeService.getSede({ id: deliveryNote.applicantId }) : await ApplicantService.getApplicant({ id: deliveryNote.applicantId });

    const info = {
      user,
      applicant: applicant.names || applicant.name,
      cedula: applicant.cedula || "",
      createStamp: new Date(deliveryNote.createStamp).toDateString(),
      returnStamp: deliveryNote.returnStamp !== undefined ? new Date(deliveryNote.returnStamp).toDateString() : ""
    }

    const data = deliveryNote.items.map((row) => {
      const wholeItem = items.filter(item => item._id === row.itemId);

      return [wholeItem['type'], wholeItem['name'], wholeItem['quantity'], '']
    });
    PdfService.createDeliveryNotePDF(info, data, ".", "Nota de Entrega");
  }

  static async updateDeliveryNote({ id, deliveryNote }) {
    const existentNote = await this.getDeliveryNote({ id });

    if (!existentNote) {
      throw new Error(`Delivery Note ${id} not found`);
    }

    return await this.MongoDB.update(this.collection, id, deliveryNote);
  }

  static async deleteDeliveryNote({ id }) {
    const existentNote = await this.getDeliveryNote({ id });

    if (!existentNote) {
      throw new Error(`Delivery Note ${id} not found`);
    }

    return await this.updateDeliveryNote({
      id,
      deliveryNote: { isDeleted: true },
    });
  }
}

module.exports = DeliveryNoteService;