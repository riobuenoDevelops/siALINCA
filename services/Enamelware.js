const MongoLib = require("../lib/db");
const ItemService = require("./Item");

class EnamelwareService {
	static MongoDB = new MongoLib();
	static collection = "enamelwares";

	static async getEnamelwares({ itemId, size, material }) {
		const query = { itemId, size, material };

		Object.keys(query).forEach((key) => {
			if (query[key] === undefined) {
				delete query[key];
			}
		});

		return await this.MongoDB.getAll(this.collection, query);
	}

	static async getEnamelware({ id }) {
		return await this.MongoDB.get(this.collection, id);
	}

	static async createEnamelware({ enamelware }) {
		return await this.MongoDB.create(this.collection, enamelware);
	}

	static async updateEnamelware({ id, enamelware }) {
		return await this.MongoDB.update(this.collection, id, enamelware);
	}

	static async deleteEnamelware({ id }) {
		const enamelware = this.getEnamelware({ id });

		await ItemService.deleteItem({ id: enamelware.itemId });

		return await this.MongoDB.delete(this.collection, id);
	}
}

module.exports = EnamelwareService;
