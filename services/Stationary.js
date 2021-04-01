const MongoLib = require("../lib/db");

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
		return await this.MongoDB.delete(this.collection, id);
	}
}

module.exports = StationaryService;