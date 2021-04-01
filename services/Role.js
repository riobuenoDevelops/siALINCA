const MongoLib = require("../lib/db");

class RoleService {
	static MongoDB = new MongoLib();
	static collection = "roles";

	static async getRoles() {
		return (await this.MongoDB.getAll(this.collection, {})) || [];
	}

	static async getRoleByName({ name }) {
		return await this.MongoDB.getAll(this.collection, { name });
	}

	static async createRole({ role }) {
		return await this.MongoDB.create(this.collection, role);
	}

	static async updateRole({ id, role }) {
		return await this.MongoDB.update(this.collection, id, role);
	}

	static async deleteRole({ id }) {
		return await this.MongoDB.delete(this.collection, id);
	}
}

module.exports = RoleService;
