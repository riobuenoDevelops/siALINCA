const MongoLib = require("../lib/db");
const ItemService = require("./Item");

class MedicineService {
	static MongoDB = new MongoLib();
	static collection = "medicines";

	static async getMedicines({ markLab, presentation, expiratedDate, itemId }) {
		const query = { itemId, presentation, markLab, expiratedDate };

		Object.keys(query).map((key) => {
			if (query[key] === undefined) {
				delete query[key];
			}
		});

		return (await this.MongoDB.getAll(this.collection, query)) || [];
	}

	static async getMedicine({ id }) {
		return await this.MongoDB.get(this.collection, id);
	}

	static async getMedicineByItem({ itemId }) {
		return await this.MongoDB.getAll(this.collection, { itemId });
	}

	static async createMedicine({ medicine }) {
		return await this.MongoDB.create(this.collection, medicine);
	}

	static async updateMedicine({ id, medicine }) {
		return await this.MongoDB.update(this.collection, id, medicine);
	}

	static async deleteMedicine({ id }) {
		const medicine = this.getMedicine({ id });

		await ItemService.deleteItem({ id: medicine.itemId });

		return await this.MongoDB.delete(this.collection, id);
	}
}

module.exports = MedicineService;
