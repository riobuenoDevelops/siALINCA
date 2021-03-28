import { config } from "../../../config/index";
import jwt from "jsonwebtoken";
import boom from "@hapi/boom";
import { errorHandler } from "../../handlers/index";

const authenticated = (fn) => async (req, res) => {
	jwt.verify(
		req.headers.authorization,
		config.authJwtSecret,
		async function (err, decoded) {
			if (!err && decoded) {
				return await fn(req, res);
			}
			errorHandler(
				boom.boomify(new Error("No esta autenticado"), { statusCode: 500 }),
				req,
				res,
			);
		},
	);
};

export default authenticated;
