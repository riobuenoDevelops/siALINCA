const MongoLib = require("../lib/db");

class ElectroDeviceService {
	static MongoDB = new MongoLib();
	static collection = "electroDevices";

	static async getElectroDevices({ itemId, deviceType, mark, model }) {
		const query = { itemId, deviceType, mark, model };

		Object.keys(query).forEach((key) => {
			if (query[key] === undefined) {
				delete query[key];
			}
		});

		return await this.MongoDB.getAll(this.collection, query);
	}

	static async getElectroDevice({ id }) {
		return await this.MongoDB.get(this.collection, id);
	}

	static async createElectroDevice({ electroDevice }) {
		return await this.MongoDB.create(this.collection, electroDevice);
	}

	static async updateElectroDevice({ id, electroDevice }) {
		return await this.MongoDB.update(this.collection, id, electroDevice);
	}

	static async deleteElectroDevice({ id }) {
		return await this.MongoDB.delete(this.collection, id);
	}
}

module.exports = ElectroDeviceService;
