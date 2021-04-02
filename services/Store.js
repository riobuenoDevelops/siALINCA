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
    disabled,
  }) {
    const query = {
      name,
      addressCity,
      addressState,
      addressCountry,
      addressZipcode,
      disabled,
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

  static async addItem({ id, items }) {
    const store = await this.getStore({ id });
    if (!store) {
      throw new Error(`Store ${id} is not found`);
    }

    return this.updateStore({
      id,
      store: { items: [...store.items, ...items] },
    });
  }

  static async createStore({ storeData }) {
    const store = {
      ...storeData,
      items: [],
    };

    return await this.MongoDB.create(this.collection, store);
  }

  static async updateStore({ id, store }) {
    const existentStore = await this.getStore({ id });

    if (!existentStore) {
      throw new Error(`Store ${id} is not found`);
    }

    return await this.MongoDB.update(this.collection, id, store);
  }

  static async deleteStore({ id }) {
    const existentStore = await this.getStore({ id });

    if (!existentStore) {
      throw new Error(`Store ${id} is not found`);
    }

    return await this.updateStore({ id, store: { disabled: true } });
  }
}

module.exports = StoreService;
