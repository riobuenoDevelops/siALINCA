const MongoLib = require("../lib/db");
const RoleService = require("./Role");

class UserService {
	static MongoDB = new MongoLib();
	static collection = "users";

	static async getUsers({ email, phone }) {
		const query = { email, phone };

		Object.keys(query).forEach((key) => {
			if (query[key] === undefined) {
				delete query[key];
			}
		});

		return (await this.MongoDB.getAll(this.collection, query)) || [];
	}

	static async getUser({ id }) {
		return await this.MongoDB.get(this.collection, id);
	}

	static async createUser({ userData }) {
		debugger;
		const userRole = await RoleService.getRoleByName({
			name: userData.roleName,
		});
		const user = {
			...userData,
			config: {
				nivelInventario: 0,
			},
			roleId: userRole[0]._id,
		};

		delete user["roleName"];

		return await this.MongoDB.create(this.collection, user);
	}

	static async updateUser({ id, user }) {
		return await this.MongoDB.update(this.collection, id, user);
	}

	static async deleteUser({ id }) {
		return await this.MongoDB.delete(this.collection, id);
	}
}

module.exports = UserService;
