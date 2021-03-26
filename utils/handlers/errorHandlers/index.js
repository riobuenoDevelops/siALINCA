const { config } = require("../../../config/index");
const boom = require("@hapi/boom");

function withStack(error, stack) {
	if (config.dev) {
		logErrors(error);
		return { ...error, stack };
	}
	return error;
}

function wrapError(err, req, res) {
	if (!err.isBoom) {
		res.json(boom.badImplementation(err));
		return false;
	}
	return true;
}

function logErrors(error) {
	console.log(error);
}

function errorHandler(err, req, res) {
	if (wrapError(err, req, res)) {
		const {
			output: { statusCode, payload },
		} = err;
		res.status(statusCode);
		res.json(withStack(payload, err.stack));
	}
}

module.exports = errorHandler;
