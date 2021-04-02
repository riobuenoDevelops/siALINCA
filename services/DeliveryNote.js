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
  }) {
    const query = {
      createStamp,
      returnStamp,
      noteType,
      applicantType,
      applicantId,
      disabled,
    };

    Object.keys(query).map((key) => {
      if (query[key] === undefined) {
        delete query[key];
      }
    });

    return (await this.MongoDB.getAll(this.collection, query)) || [];
  }

  static async getDeliveryNote({ id }) {
    const note = this.MongoDB.get(this.collection, id);

    if (!note) {
      throw new Error(`Delivery Note ${id} not found`);
    }

    return note;
  }

  static async createDeliveryNote({ deliveryNote }) {
    return await this.MongoDB.create(this.collection, deliveryNote);
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
      deliveryNote: { disabled: true },
    });
  }
}

module.exports = DeliveryNoteService;
