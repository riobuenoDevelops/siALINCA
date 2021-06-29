const MongoLib = require("../lib/db");
const MedicineService = require("./Medicine");
const MealService = require("./Meal");
const ElectroDeviceService = require("./ElectroDevice");
const EnamelwareService = require("./Enamelware");
const PropertyService = require("./Property");
const StationaryService = require("./Stationary");
const PubNubService = require("./PubNub")
const UserService = require("./User");

class ItemService {
  static MongoDB = new MongoLib();
  static collection = "items";

  static async getItems({
    quantity,
    userId,
    type,
    disabled,
    isDeleted,
    createdAt,
    startDate,
    endDate
  }) {
    let itemsWithChild = [];
    let query = {
      quantity,
      userId,
      type,
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

    const items = await this.MongoDB.getAll(this.collection, query);

    for(let i = 0; i < items.length; i++) {
      const item = await this.getItem({ id: items[i]._id, withChild: "true" });
      itemsWithChild.push(item);
    }

    return itemsWithChild;
  }

  static async getItem({ id, withChild }) {
    const item = await this.MongoDB.get(this.collection, id);
    if (withChild === "true") {
      const childItem = await this.getItemByType({ id, type: item.type });
      return { ...item, ...childItem };
    }
    return item;
  }

  static async getItemByType({ id, type }) {
    let item = {};
    switch (type) {
      case "medicine":
        item = await MedicineService.getMedicines({ itemId: id });
        break;
      case "meal":
        item = await MealService.getMeals({ itemId: id });
        break;
      case "electroDevice":
        item = await ElectroDeviceService.getElectroDevices({ itemId: id });
        break;
      case "property":
        item = await PropertyService.getProperties({ itemId: id });
        break;
      case "enamelware":
        item = await EnamelwareService.getEnamelwares({ itemId: id });
        break;
      case "stationary":
        item = await StationaryService.getStationarys({ itemId: id });
        break;
    }

    return item[0];
  }

  static async createItem({ item }) {
    return await this.MongoDB.create(this.collection, {
      ...item,
      disabled: false,
      isDeleted: false,
      createdAt: new Date(Date.now())
    });
  }

  static async updateItem({ id, item, email }) {
    if(!PubNubService.channel) {
      PubNubService.initialize(email, 'notifications');
      PubNubService.subscribe();
    }

    const existentItem = await this.getItem({ id, withChild: false });
    const user = await UserService.getUsers({email});

    if (!existentItem) {
      throw new Error(`Item ${id} is not found`);
    }

    const updatedId = await this.MongoDB.update(this.collection, id, item);

    if(item.quantity <= user[0].config.nivelInventario) {
      PubNubService.publish(`El item ${item.name} ha alcanzado el nivel mínimo de inventario`);
    }

    return updatedId
  }

  static async deleteItem({ id }) {
    const existentItem = await this.getItem({ id, withChild: false });

    if (!existentItem) {
      throw new Error(`Item ${id} is not found`);
    }

    return await this.updateItem({ id, item: { isDeleted: true } });
  }
}

module.exports = ItemService;
