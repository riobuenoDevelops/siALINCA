const { compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { config } = require("../config/index");
const UserService = require("./User");
const RoleService = require("./Role");

class AuthService {
  static async login({ email, password }) {
    if (!email || !password) {
      throw new Error("Email and password required");
      return;
    }

    const user = await UserService.getUsers({ email });

    if (!user) {
      throw new Error(`User with email ${email} not found`);
      return;
    }
    if (!user[0].disabled) {
      throw new Error("This user has been disabled by an administrator");
    }

    compare(password, user[0].password, async function (err, result) {
      if (!err && result) {
        const {
          _id: id,
          names,
          lastNames,
          email,
          roleId,
          config: userConfig,
        } = user[0];

        const rolePermissions = await RoleService.getRole({ id: roleId });

        const claims = {
          sub: id,
          user: {
            names,
            lastNames,
            roleId,
            userConfig,
            email,
          },
          permissions: rolePermissions.permissions || null,
        };
        return jwt.sign(claims, config.authJwtSecret, {
          expiresIn: "20h",
        });
      } else {
        throw new Error("Email or password invalid");
      }
    });
  }
}

module.exports = AuthService;
