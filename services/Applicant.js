const MongoLib = require("../lib/db");

class ApplicantService {
  static MongoDB = new MongoLib();
  static collection = "applicants";

  static async getApplicants({ cedula, phone, isDeleted, disabled, createdAt, startDate, endDate }) {
    let query = { cedula, phone, isDeleted, disabled, createdAt };

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

  static async getApplicant({ id }) {
    return await this.MongoDB.get(this.collection, id);
  }

  static async createApplicant({ applicant }) {
    return await this.MongoDB.create(this.collection, {
      ...applicant,
      isDeleted: false,
      disabled: false,
      createdAt: new Date(Date.now())
    });
  }

  static async updateApplicant({ id, applicant }) {
    const existentApplicant = await this.getApplicant({ id });

    if (!existentApplicant) {
      throw new Error(`Applicant ${id} is not found`);
    }

    return await this.MongoDB.update(this.collection, id, applicant);
  }

  static async deleteApplicant({ id }) {
    const existentApplicant = await this.getApplicant({ id });

    if (!existentApplicant) {
      throw new Error(`Applicant ${id} is not found`);
    }

    return await this.updateApplicant({ id, applicant: { isDeleted: true } });
  }
}

module.exports = ApplicantService;
