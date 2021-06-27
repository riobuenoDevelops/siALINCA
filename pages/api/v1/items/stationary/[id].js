import boom from "@hapi/boom";
import { errorHandler } from "../../../../../utils/handlers/index";
import authenticated from "../../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import StationaryService from "../../../../../services/Stationary";

async function deleteMethodHandler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    const deletedItemId = await StationaryService.deleteStationary({ id });
    res.status(200).json(deletedItemId);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}
async function updateMethodHandler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    const updatedItemId = await StationaryService.updateStationary({ id, stationary: req.body });
    res.status(200).json(updatedItemId);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

export default authenticated(async function (req, res) {
  const { method } = req;

  switch (method) {
    case "PUT":
      schemaValidator("modelId", "query", req, res, function (req, res) {
        scopeValidator(["update:item"], req, res, updateMethodHandler);
      });
      break;
    case "DELETE":
      schemaValidator("modelId", "query", req, res, function (req, res) {
        scopeValidator(["disable:item"], req, res, deleteMethodHandler);
      });
      break;
    default:
      errorHandler(
        boom.methodNotAllowed(
          "This endpoint only accepts PUT, DELETE requests"
        ),
        req,
        res
      );
  }
});