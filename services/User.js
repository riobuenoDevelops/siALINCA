const MongoLib = require("../lib/db");
const RoleService = require("./Role");
const bcrypt = require("bcrypt");

class UserService {
  static MongoDB = new MongoLib();
  static collection = "users";

  static async getUsers({ email, roleId, disabled }) {
    const query = { email, roleId, disabled };

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
    const userRole = await RoleService.getRoleByName({
      name: userData.roleName,
    });

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = {
      ...userData,
      config: {
        nivelInventario: 0,
      },
      roleId: userRole[0]._id,
      password: hashedPassword,
      disabled: false,
    };

    delete user["roleName"];

    return await this.MongoDB.create(this.collection, user);
  }

  static async updateUser({ id, user }) {
    const existentUser = await this.getUser({ id });

    if (!existentUser) {
      throw new Error(`User ${id} is not found`);
      return;
    }

    return await this.MongoDB.update(this.collection, id, user);
  }

  static async deleteUser({ id }) {
    const existentUser = await this.getUser({ id });
    if (!existentUser) {
      throw new Error(`User ${id} is not found`);
      return;
    }

    return await this.updateUser({ id, user: { disabled: true } });
  }
}

module.exports = UserService;
