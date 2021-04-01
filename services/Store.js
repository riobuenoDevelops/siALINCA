const MongoLib = require("../lib/db");
const ItemService = require("./Item");

class StoreService {
	static MongoDB = new MongoLib();
	static collection = "stores";

	static async getStores({
		name,
		addressCity,
		addressState,
		addressCountry,
		addressZipcode,
	}) {
		const query = {
			name,
			addressCity,
			addressState,
			addressCountry,
			addressZipcode,
		};

		Object.keys(query).forEach((key) => {
			if (query[key] === undefined) {
				delete query[key];
			}
		});

		return (await this.MongoDB.getAll(this.collection, query)) || [];
	}

	static async getStore({ id }) {
		return await this.MongoDB.get(this.collection, id);
	}

	static getStoreItems({ ids }) {
		const items = [];
		ids.map(async (itemId) => {
			const item = await ItemService.getItems({ id: itemId });
			items.push(item);
		});
		return items;
	}

	static async addItem({id, itemId, quantity}){
		const store = await this.getStore({id});
		if(!store){
			throw new Error("El almacen no existe.");
		}

		return this.updateStore({id, store: {items: [
			...store.items,
			{itemId,
			quantity}
		]}})
	}

	static async createStore({ storeData }) {
		const store = {
			...storeData,
			items: [],
		};

		return await this.MongoDB.create(this.collection, store);
	}

	static async updateStore({ id, store }) {
		return await this.MongoDB.update(this.collection, id, store);
	}

	static async deleteStore({ id }) {
		return await this.MongoDB.delete(this.collection, id);
	}
}

module.exports = StoreService;
