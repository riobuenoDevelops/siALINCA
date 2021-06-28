const MongoLib = require("../lib/db");
const ItemService = require("./Item");

class StationaryService {
	static MongoDB = new MongoLib();
	static collection = "stationary";

	static async getStationarys({ itemId, mark }) {
		const query = { itemId, mark };

		Object.keys(query).forEach((key) => {
			if (query[key] === undefined) {
				delete query[key];
			}
		});

		return await this.MongoDB.getAll(this.collection, query);
	}

	static async getStationary({ id }) {
		return await this.MongoDB.get(this.collection, id);
	}

	static async createStationary({ stationary }) {
		return await this.MongoDB.create(this.collection, stationary);
	}

	static async updateStationary({ id, stationary }) {
		return await this.MongoDB.update(this.collection, id, stationary);
	}

	static async deleteStationary({ id }) {
		const stationary = await this.getStationary({ id });

		if(!stationary) {
			throw new Error(`El item con el id ${id} no existe`);
		}

		await ItemService.deleteItem({ id: stationary.itemId });

		return await this.updateStationary({ id, stationary: { deleted: true } });
	}
}

module.exports = StationaryService;
