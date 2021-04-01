const MongoLib = require("../lib/db");

class PurchaseOrderService {
	static MongoDB = new MongoLib();
	static collection = "purchaseOrders";

	static async getPurchaseOrders({ date, currency, totalPrice }) {
		const query = {
			date,
			currency,
			totalPrice,
		};

		Object.keys(query).map((key) => {
			if (query[key] === undefined) {
				delete query[key];
			}
		});

		return (await this.MongoDB.getAll(this.collection, query)) || [];
	}

	static async getPurchaseOrder({ id }) {
		return await this.MongoDB.get(this.collection, id);
	}

	static async createPurchaseOrder({ purchaseOrder }) {
		return await this.MongoDB.create(this.collection, purchaseOrder);
	}

	static async updatePurchaseOrder({ id, purchaseOrder }) {
		return await this.MongoDB.update(this.collection, id, purchaseOrder);
	}

	static async deletePurchaseOrder({ id }) {
		return await this.MongoDB.delete(this.collection, id);
	}
}

module.exports = PurchaseOrderService;
