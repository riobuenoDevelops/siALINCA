const MongoLib = require("../lib/db");

class MeasureService {
  static MongoDB = new MongoLib();
  static collection = "measures";

  static async getMeasures({ name }) {
    const query = { name };

    Object.keys(query).forEach((key) => {
      if (query[key] === undefined) {
        delete query[key];
      }
    });

    return await this.MongoDB.getAll(this.collection, query);
  }

  static async addMarkLab({ name }) {
    const marks = await this.getMeasures({ name: "markLabs" });
    return await this.MongoDB.update(this.collection, marks[0]._id, {
      measures: [...marks[0].measures, { label: name, value: name }],
    });
  }

  static async addMealPresentation({ name }) {
    const mealPresentations = await this.getMeasures({
      name: "mealPresentations",
    });
    if (!mealPresentations.length) {
      return await this.MongoDB.create(this.collection, {
        name: "mealPresentations",
        measures: [{ label: name, value: name }],
      });
    }
    return await this.MongoDB.update(
      this.collection,
      mealPresentations[0]._id,
      {
        measures: [
          ...mealPresentations[0].measures,
          { label: name, value: name },
        ],
      }
    );
  }

  static async addEnamelwareMaterial({ name }) {
    const enamelwareMaterials = await this.getMeasures({
      name: "enamelwareMaterials",
    });
    if (!enamelwareMaterials.length) {
      return await this.MongoDB.create(this.collection, {
        name: "enamelwareMaterials",
        measures: [{ label: name, value: name }],
      });
    }
    return await this.MongoDB.update(
      this.collection,
      enamelwareMaterials[0]._id,
      {
        measures: [
          ...enamelwareMaterials[0].measures,
          { label: name, value: name },
        ],
      }
    );
  }
}

module.exports = MeasureService;
