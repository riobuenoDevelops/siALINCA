const MongoLib = require("../lib/db");
const MedicineService = require("./Medicine");
const MealService = require("./Meal");
const ElectroDeviceService = require("./ElectroDevice");
const EnamelwareService = require("./Enamelware");
const PropertyService = require("./Property");
const StationaryService = require("./Stationary");

class ItemService {
  static MongoDB = new MongoLib();
  static collection = "items";

  static async getItems({ quantity, userId, type, disabled }) {
    const query = { quantity, userId, type, disabled };

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
        return (await MealService.getMeals({ itemId: id })[0]) || null;
        break;
      case "electroDevice":
        return (
          (await ElectroDeviceService.getElectroDevices({ itemId: id })[0]) ||
          null
        );
        break;
      case "property":
        return (await PropertyService.getProperties({ itemId: id })[0]) || null;
        break;
      case "enamelware":
        return (
          (await EnamelwareService.getEnamelwares({ itemId: id })[0]) || null
        );
        break;
      case "stationary":
        return (
          (await StationaryService.getStationarys({ itemId: id })[0]) || null
        );
        break;
    }
  }

  static async createItem({ item }) {
    return await this.MongoDB.create(this.collection, {...item, disabled: false});
  }

  static async updateItem({ id, item }) {
    const existentItem = await this.getItem({ id, withChild: false });

    if (!existentItem) {
      throw new Error(`Item ${id} is not found`);
    }

    return await this.MongoDB.update(this.collection, id, item);
  }

  static async deleteItem({ id }) {
    const existentItem = await this.getItem({ id, withChild: false });

    if (!existentItem) {
      throw new Error(`Item ${id} is not found`);
    }

    return await this.updateItem({ id, item: { disabled: true } });
  }
}

module.exports = ItemService;
