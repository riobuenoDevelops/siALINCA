const MongoLib = require("../lib/db");

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
    return await this.MongoDB.create(this.collection, {
      ...deliveryNote,
      disabled: false,
      isDeleted: false,
      createdAt: new Date(Date.now())
    });
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
