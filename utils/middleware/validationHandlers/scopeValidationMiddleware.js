const boom = require("@hapi/boom");
const { errorHandler } = require("../../handlers/index");
const jwt = require("jsonwebtoken");

function scopeValidationMiddleware(allowedScopes, req, res, fn) {
	const decodedToken = jwt.decode(req.headers.authorization);
	if (!decodedToken.user || !decodedToken.permissions) {
		errorHandler(boom.unauthorized("Token Inválido"), req, res);
	}

	const hasAccess = allowedScopes
		.map((allowedScope) => decodedToken.permissions.includes(allowedScope))
		.find((allowed) => Boolean(allowed));

	if (hasAccess) {
		fn(req, res);
	} else {
		errorHandler(
			boom.unauthorized(
				"No tiene permisos suficientes para realizar esta acción",
			),
			req,
			res,
		);
	}
}

module.exports = scopeValidationMiddleware;
