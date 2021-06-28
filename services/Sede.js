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
    disabled,
    deleted,
    createdAt,
    startDate,
    endDate
  }) {
    let query = {
      name,
      addressCity,
      addressZipcode,
      addressState,
      addressCountry,
      disabled,
      deleted,
      createdAt
    };

    Object.keys(query).map((key) => {
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

    return (await this.MongoDB.getAll(this.collection, query)) || [];
  }

  static async getSede({ id }) {
    return await this.MongoDB.get(this.collection, id);
  }

  static async createSede({ sede }) {
    return await this.MongoDB.create(this.collection, {
      ...sede,
      disabled: false,
      deleted: false,
      createAt: new Date(Date.now())
    });
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

    return await this.updateSede({ id, sede: { deleted: true } });
  }
}

module.exports = SedeService;
