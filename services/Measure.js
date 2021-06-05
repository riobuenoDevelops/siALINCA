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

  static async addMedicineMarkLab({ name }) {
    const medicineMarkLabs = await this.getMeasures({
      name: "medicineMarkLabs",
    });
    if (!medicineMarkLabs.length) {
      return await this.MongoDB.create(this.collection, {
        name: "medicineMarkLabs",
        measures: [{ label: name, value: name }],
      });
    }
    return await this.MongoDB.update(this.collection, medicineMarkLabs[0]._id, {
      measures: [...medicineMarkLabs[0].measures, { label: name, value: name }],
    });
  }

  static async addMedicinePresentation({ name }) {
    const medicinePresentations = await this.getMeasures({
      name: "medicinePresentation",
    });
    if (!medicinePresentations.length) {
      return await this.MongoDB.create(this.collection, {
        name: "medicinePresentation",
        measures: [{ label: name, value: name }],
      });
    }
    return await this.MongoDB.update(
      this.collection,
      medicinePresentations[0]._id,
      {
        measures: [
          ...medicinePresentations[0].measures,
          { label: name, value: name },
        ],
      }
    );
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

  static async addPropertyMaterial({ name }) {
    const propertyMaterials = await this.getMeasures({
      name: "propertyMaterials",
    });
    if (!propertyMaterials.length) {
      return await this.MongoDB.create(this.collection, {
        name: "propertyMaterials",
        measures: [{ label: name, value: name }],
      });
    }
    return await this.MongoDB.update(
      this.collection,
      propertyMaterials[0]._id,
      {
        measures: [
          ...propertyMaterials[0].measures,
          { label: name, value: name },
        ],
      }
    );
  }

  static async addPropertyMark({ name }) {
    const propertyMarks = await this.getMeasures({
      name: "propertyMarks",
    });
    if (!propertyMarks.length) {
      return await this.MongoDB.create(this.collection, {
        name: "propertyMarks",
        measures: [{ label: name, value: name }],
      });
    }
    return await this.MongoDB.update(this.collection, propertyMarks[0]._id, {
      measures: [...propertyMarks[0].measures, { label: name, value: name }],
    });
  }

  static async addStationaryMark({ name }) {
    const stationaryMarks = await this.getMeasures({
      name: "stationaryMarks",
    });
    if (!stationaryMarks.length) {
      return await this.MongoDB.create(this.collection, {
        name: "stationaryMarks",
        measures: [{ label: name, value: name }],
      });
    }
    return await this.MongoDB.update(this.collection, stationaryMarks[0]._id, {
      measures: [...stationaryMarks[0].measures, { label: name, value: name }],
    });
  }

  static async addStationaryPresentation({ name }) {
    const stationaryPresentations = await this.getMeasures({
      name: "stationaryPresentations",
    });
    if (!stationaryPresentations.length) {
      return await this.MongoDB.create(this.collection, {
        name: "stationaryPresentations",
        measures: [{ label: name, value: name }],
      });
    }
    return await this.MongoDB.update(
      this.collection,
      stationaryPresentations[0]._id,
      {
        measures: [
          ...stationaryPresentations[0].measures,
          { label: name, value: name },
        ],
      }
    );
  }
}

module.exports = MeasureService;
