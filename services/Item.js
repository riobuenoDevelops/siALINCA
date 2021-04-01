const MongoLib = require("../lib/db");

class ItemService {
	static MongoDB = new MongoLib();
	static collection = "items";

	static async getItems({ quantity, userId, type }) {
		const query = { quantity, userId, type };

		Object.keys(query).forEach((key) => {
			if (query[key] === undefined) {
				delete query[key];
			}
		});

		return await this.MongoDB.getAll(this.collection, query);
	}

	static async getItem({ id, withChild }) {
		const item = await this.MongoDB.get(this.collection, id);
		if (withChild) {
			const childItem = this.getItemByType({ id, type: item.type });
			return { ...item, ...childItem };
		}
		return item;
	}

	static async getItemByType({ id, type }) {
		switch (type) {
			case "medicine":
				return (await MedicineService.getMedicines({ itemId: id })[0]) || null;
			case "meal":
				break;
			case "electroDevice":
				break;
			case "property":
				break;
			case "enamelware":
				break;
			case "stationary":
				break;
		}

		return item;
	}

	static async createItem({ item }) {
		return await this.MongoDB.create(this.collection, item);
	}

	static async updateItem({ id, item }) {
		return await this.MongoDB.update(this.collection, id, item);
	}

	static async deleteItem({ id }) {
		return await this.MongoDB.delete(this.collection, id);
	}
}

module.exports = ItemService;
