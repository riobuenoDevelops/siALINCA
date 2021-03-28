const Ajv = require("ajv").default;
const ajv = new Ajv();

//schemas
const modelIdSchema = require("./ModelId");
const { roleSchema, updatedRoleSchema } = require("./Role");
const { userSchema, updatedUserSchema } = require("./User");

ajv.addSchema(modelIdSchema);
ajv.addSchema(roleSchema);
ajv.addSchema(updatedRoleSchema);
ajv.addSchema(userSchema);
ajv.addSchema(updatedUserSchema);

module.exports = ajv;
