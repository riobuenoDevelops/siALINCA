const boom = require("@hapi/boom");
const { errorHandler } = require("../../handlers/index");
const schemaValidator = require("../../models/index");

function schemaValidationMiddleware(schemaName, check = "body", req, res, fn) {
  const validator = schemaValidator.getSchema(schemaName);

  const isValid =
    check === "query" ? validator(req[check].id) : validator(req[check]);

  if (isValid) {
    fn(req, res);
  } else {
    errorHandler(boom.badRequest(validator.errors[0].message), req, res);
  }
}

module.exports = schemaValidationMiddleware;
