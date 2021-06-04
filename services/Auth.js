const { compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const { config } = require("../config/index");
const UserService = require("./User");
const RoleService = require("./Role");

class AuthService {
  static async login({ email, password }) {
    if (!email || password === undefined) {
      throw new Error("Email and password required");
    }

    const user = await UserService.getUsers({ email });
    if (!user.length) {
      throw new Error(`Usuario ${email} no existe`);
    }
    if (user[0].disabled) {
      throw new Error(
        "Este usuario ha sido deshabilitado por un administrador"
      );
    }

    const match = await compare(password, user[0].password);

    if (match) {
      const {
        _id: id,
        names,
        lastNames,
        email,
        roleId,
        config: userConfig,
      } = user[0];

      const role = await RoleService.getRole({ id: roleId });

      const claims = {
        sub: id,
        user: {
          names,
          lastNames,
          roleName: role.name,
          userConfig,
          email,
        },
        permissions: role.permissions || null,
      };

      const token = jwt.sign(claims, config.authJwtSecret, {
        expiresIn: "20h",
      });

      return {
        token,
        user: { _id: id, email, names, lastNames, roleName: role.name, userConfig },
      };
    } else {
      throw new Error("Correo o contraseña invalidos");
    }
  }
}

module.exports = AuthService;
