const MongoLib = require("../lib/db");

class ApplicantService {
  static MongoDB = new MongoLib();
  static collection = "applicants";

  static async getApplicants({ cedula, phone }) {
    const query = { cedula, phone };

    Object.keys(query).map((key) => {
      if (query[key] === undefined) {
        delete query[key];
      }
    });

    return (await this.MongoDB.getAll(this.collection, query)) || [];
  }

  static async getApplicant({ id }) {
    return await this.MongoDB.get(this.collection, id);
  }

  static async createApplicant({ applicant }) {
    return await this.MongoDB.create(this.collection, applicant);
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

    return await this.updateApplicant({ id, applicant: { disabled: true } });
  }
}

module.exports = ApplicantService;
