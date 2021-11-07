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
    isDeleted,
    createdAt,
    startDate,
    endDate
  }) {
    let query = {
      name,
      addressCity,
      addressState,
      addressCountry,
      addressZipcode,
      disabled,
      isDeleted,
      createdAt
    };

    Object.keys(query).forEach((key) => {
      if (query[key] === undefined) {
        delete query[key];
      }
    });

    if(startDate) {
      query = {
        ...query,
        createdAt: {
          "$gte": new Date(startDate),
          "lt": new Date(endDate)
        }
      }
    }

    return (await this.MongoDB.getAll(this.collection, query)).map((store) => ({...store, id: store._id.toString(), createdAt: store.createdAt.toString()})) || [];
  }

  static async getStore({ id }) {
    return await this.MongoDB.get(this.collection, id);
  }

  static async getStoreItems({ id }) {
    let items = [];

    const store = await this.getStore({ id });
    
    for(let i = 0; i < store.items.length; i++){
      let item = await ItemService.getItem({ id: store.items[i].itemId });
      items.push(item);
    }
    return items;
  }

  static async addItem({ id, items }) {
    const store = await this.getStore({ id });
    if (!store) {
      throw new Error(`Store ${id} is not found`);
    }

    if(store.items.length) {
      return this.updateStore({
        id,
        store: { items: [...store.items, ...items] },
      });
    }
    return this.updateStore({
      id,
      store: { items },
    });
  }

  static async updateStoreItems({ id, items }) {
    const store = await this.getStore({ id });

    return await this.updateStore({ id, store: {
      ...store,
      items
    }})
  }

  static async getStoresByItem({id}) {
    let itemStores = [];
    const stores = await this.getStores({ disabled: false });

    if(!stores.length){
      new Error("No hay ningún Almacén disponible");
    }

    for(let i = 0; i < stores.length; i++){
      if(stores[i].items?.some((item) => item.itemId === id)) {
        itemStores.push({ store: stores[i].name, storeId: stores[i]._id, quantity: stores[i].items.filter((item) => item.itemId === id)[0].quantity});
      }
    }

    return itemStores;
  }

  static async transferItemfromStoreToStore({ originStoreId, itemId, quantity, destinationStoreId }) {
    let originNewItems = [];
    let destinationNewItems = [];
    try {
      const originStore = await this.getStore({ id: originStoreId });
      const destinationStore = await this.getStore({ id: destinationStoreId });

      if(!originStore._id || !destinationStore._id) {
        throw new Error("Los almacenes seleccionados no existen o estan deshabilitados");
      }

      const storedItem = originStore.items.filter(item => item.itemId === itemId)[0];

      if((storedItem - quantity) === 0) {
        originNewItems = originStore.items.filter(item => item.itemId !== itemId);
      } else {
        originNewItems = originStore.items.map(item => {
          if (item.itemId === itemId){
            return {
              ...item,
              quantity: item.quantity - quantity
            };
          }
          return item;
        })
      }

      if(!destinationStore.items.some(item => item.itemId === itemId)) {
        destinationNewItems = destinationStore.items;
        destinationNewItems.push({ itemId, quantity });
      } else {
        destinationNewItems = destinationStore.items.map(item => {
          if (item.itemId === itemId) {
            return {
              ...item,
              quantity: item.quantity + quantity
            }
          }
          return item;
        })
      }

      console.log(originNewItems);
      console.log(destinationNewItems);

      await this.updateStoreItems({ id: originStoreId, items: originNewItems });
      await this.updateStoreItems({ id: destinationStoreId, items: destinationNewItems })

    }catch (err) {
      throw new Error(err)
    }
  }

  static async createStore({ storeData }) {
    const store = {
      ...storeData,
      items: [],
    };

    return await this.MongoDB.create(this.collection, {
      ...store,
      disabled: false,
      isDeleted: false,
      createdAt: new Date(Date.now())
    });
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

    return await this.updateStore({ id, store: { isDeleted: true } });
  }
}

module.exports = StoreService;
