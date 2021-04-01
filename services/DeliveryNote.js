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
	}) {
		const query = {
			createStamp,
			returnStamp,
			noteType,
			applicantType,
			applicantId,
		};

		Object.keys(query).map((key) => {
			if (query[key] === undefined) {
				delete query[key];
			}
		});

		return (await this.MongoDB.getAll(this.collection, query)) || [];
	}

	static async getDeliveryNote({ id }) {
		return await this.MongoDB.get(this.collection, id);
	}

	static async createDeliveryNote({ deliveryNote }) {
		return await this.MongoDB.create(this.collection, deliveryNote);
	}

	static async updateDeliveryNote({ id, deliveryNote }) {
		return await this.MongoDB.update(this.collection, id, deliveryNote);
	}

	static async deleteDeliveryNote({ id }) {
		return await this.MongoDB.delete(this.collection, id);
	}
}

module.exports = DeliveryNoteService;
