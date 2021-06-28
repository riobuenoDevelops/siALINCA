const userSchema = {
  $id: "user",
  type: "object",
  properties: {
    _id: { $ref: "modelId#" },
    names: { type: "string" },
    lastNames: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    roleId: { $ref: "role#/properties/_id" },
    config: {
      type: "object",
      properties: {
        nivelInventario: { type: "integer" },
      },
    },
    disabled: { type: "boolean" },
    deleted: { type: "boolean" },
    createAt: { type: "date" }
  },
  required: ["names", "lastNames", "email", "password"],
  additionalProperties: true,
};

const updatedUserSchema = {
  $id: "updateUser",
  type: "object",
  properties: {
    _id: { $ref: "modelId#" },
    names: { type: "string" },
    lastNames: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    roleId: { $ref: "role#/properties/_id" },
    config: {
      type: "object",
      properties: {
        nivelInventario: { type: "integer" },
      },
    },
    disabled: { type: "boolean" },
    deleted: { type: "boolean" },
    createAt: { type: "date" }
  },
  additionalProperties: true,
};

module.exports = {
  userSchema,
  updatedUserSchema,
};
