import boom from "@hapi/boom";
import { errorHandler } from "../../../../../utils/handlers/index";
import authenticated from "../../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import StationaryService from "../../../../../services/Stationary";

async function postMethodHandler(req, res) {
  try {
    res.status(200).json(await StationaryService.createStationary({ stationary: req.body }));
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

export default authenticated(async function (req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      schemaValidator("stationary", "body", req, res, (req, res) => {
        scopeValidator(["create:item"], req, res, postMethodHandler);
      });
      break;
    default:
      errorHandler(
        boom.methodNotAllowed(
          "This endpoint only accepts GET and POST requests"
        ),
        req,
        res
      );
  }
});
