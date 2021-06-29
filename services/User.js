const MongoLib = require("../lib/db");
const { config } = require("../config/index");
const RoleService = require("./Role");
const Cryptr = require("cryptr");

class UserService {
  static MongoDB = new MongoLib();
  static collection = "users";
  static cryptrInstance = new Cryptr(config.passwordSecret);

  static async getUsers({ email, roleId, isDeleted, disabled, createdAt, startDate, endDate }) {
    let query = { email, roleId, isDeleted, disabled, createdAt };

    Object.keys(query).forEach((key) => {
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

  static async getUser({ id }) {
    return await this.MongoDB.get(this.collection, id);
  }

  static async createUser({ userData }) {
    const userRole = await RoleService.getRoleByName({
      name: userData.roleName,
    });

    const hashedPassword = this.cryptrInstance.encrypt(userData.password);

    const user = {
      ...userData,
      config: {
        nivelInventario: 0,
      },
      roleId: userRole[0]._id,
      password: hashedPassword,
      disabled: false,
      isDeleted: false,
      createdAt: new Date(Date.now())
    };

    delete user["roleName"];

    return await this.MongoDB.create(this.collection, user);
  }

  static async updateUser({ id, user }) {
    let hashedPassword, roleId;
    const existentUser = await this.getUser({ id });

    if (!existentUser) {
      throw new Error(`User ${id} is not found`);
    }

    hashedPassword = this.cryptrInstance.encrypt(user.password);

    const role = await RoleService.getRoleByName({ name: user.roleName });

    if (role._id !== existentUser.roleId) {
      roleId = role._id;
    }

    delete user["roleName"];

    return await this.MongoDB.update(this.collection, id, {
      ...user,
      password: hashedPassword,
      roleId: roleId ? roleId : existentUser.roleId,
    });
  }

  static async deleteUser({ id }) {
    const existentUser = await this.getUser({ id });
    if (!existentUser) {
      throw new Error(`User ${id} is not found`);
    }

    return await this.updateUser({ id, user: { isDeleted: true } });
  }
}

module.exports = UserService;
