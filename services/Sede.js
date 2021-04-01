const MongoLib = require("../lib/db");

class SedeService {
  static MongoDB = new MongoLib();
  static collection = "sedes";

  static async getSedes({
    name,
    addressCity,
    addressZipcode,
    addressState,
    addressCountry,
  }) {
    const query = {
      name,
      addressCity,
      addressZipcode,
      addressState,
      addressCountry,
    };

    Object.keys(query).map((key) => {
      if (query[key] === undefined) {
        delete query[key];
      }
    });

    return (await this.MongoDB.getAll(this.collection, query)) || [];
  }

  static async getSede({ id }) {
    return await this.MongoDB.get(this.collection, id);
  }

  static async createSede({ sede }) {
    return await this.MongoDB.create(this.collection, sede);
  }

  static async updateSede({ id, sede }) {
    const existentSede = await this.getSede({ id });

    if (!existentSede) {
      throw new Error(`Sede ${id} is not found`);
    }

    return await this.MongoDB.update(this.collection, id, sede);
  }

  static async deleteSede({ id }) {
    const existentSede = await this.getSede({ id });

    if (!existentSede) {
      throw new Error(`Sede ${id} is not found`);
    }

    return await this.updateSede({ id, sede: { disabled: true } });
  }
}

module.exports = SedeService;
