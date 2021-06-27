const MongoLib = require("../lib/db");
const ItemService = require("./Item");

class PropertyService {
	static MongoDB = new MongoLib();
	static collection = "properties";

	static async getProperties({
		itemId,
		serial,
		model,
		mark,
		material,
		addressCountry,
		addressCity,
		addressState,
		addressZipcode,
	}) {
		const query = {
			itemId,
			serial,
			model,
			mark,
			material,
			addressCountry,
			addressCity,
			addressState,
			addressZipcode,
		};

		Object.keys(query).forEach((key) => {
			if (query[key] === undefined) {
				delete query[key];
			}
		});

		return await this.MongoDB.getAll(this.collection, query);
	}

	static async getProperty({ id }) {
		return await this.MongoDB.get(this.collection, id);
	}

	static async createProperty({ property }) {
		return await this.MongoDB.create(this.collection, property);
	}

	static async updateProperty({ id, property }) {
		return await this.MongoDB.update(this.collection, id, property);
	}

	static async deleteProperty({ id }) {
		const property = this.getProperty({ id });

		await ItemService.deleteItem({ id: property.itemId });

		return await this.MongoDB.delete(this.collection, id);
	}
}

module.exports = PropertyService;
