const MongoLib = require("../lib/db");

class PurchaseOrderService {
  static MongoDB = new MongoLib();
  static collection = "purchaseOrders";

  static async getPurchaseOrders({ date, currency, totalPrice, disabled }) {
    const query = {
      date,
      currency,
      totalPrice,
      disabled,
    };

    Object.keys(query).map((key) => {
      if (query[key] === undefined) {
        delete query[key];
      }
    });

    return (await this.MongoDB.getAll(this.collection, query)) || [];
  }

  static async getPurchaseOrder({ id }) {
    const existentOrder = await this.getPurchaseOrder({ id });

    if (!existentOrder) {
      throw new Error(`Order ${id} not found`);
    }

    return await this.MongoDB.get(this.collection, id);
  }

  static async addBills({ id, bills }) {
    const existentOrder = await this.getPurchaseOrder({ id });

    if (!existentOrder) {
      throw new Error(`Order ${id} not found`);
    }

    return this.updatePurchaseOrder({
      id,
      purchaseOrder: { bills: [...existentOrder.bills, ...bills] },
    });
  }

  static async createPurchaseOrder({ purchaseOrder }) {
    return await this.MongoDB.create(this.collection, purchaseOrder);
  }

  static async updatePurchaseOrder({ id, purchaseOrder }) {
    const existentOrder = await this.getPurchaseOrder({ id });

    if (!existentOrder) {
      throw new Error(`Order ${id} not found`);
    }

    return await this.MongoDB.update(this.collection, id, purchaseOrder);
  }

  static async deletePurchaseOrder({ id }) {
    const existentOrder = await this.getPurchaseOrder({ id });

    if (!existentOrder) {
      throw new Error(`Order ${id} not found`);
    }

    return await this.updatePurchaseOrder({
      id,
      purchaseOrder: { disabled: true },
    });
  }
}

module.exports = PurchaseOrderService;
