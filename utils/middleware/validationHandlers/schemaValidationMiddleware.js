const boom = require("@hapi/boom");
const errorHandler = require("../../handlers/errorHandlers/index");
const schemaValidator = require("../../models/index");

function schemaValidationMiddleware(schemaName, check = "body", req, res, fn) {
	const validator = schemaValidator.getSchema(schemaName);

	if (validator(req[check])) {
		fn(req, res);
	} else {
		errorHandler(boom.badRequest(validator.errors.toString()), req, res);
	}
}
