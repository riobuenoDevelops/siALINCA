import boom from "@hapi/boom";
import { errorHandler } from "../../../../../utils/handlers";
import authenticated from "../../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import StoreService from "../../../../../services/Store";

async function getMethodHandler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    res.status(200).json(await StoreService.getStore({ id }));
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function updateMethodHandler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    res.status(200).json(
      await StoreService.updateStore({
        id,
        store: req.body,
      })
    );
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function deleteMethodHandler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    res.status(200).json(await StoreService.deleteStore({ id }));
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

export default authenticated(async function (req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      schemaValidator("modelId", "query", req, res, function (req, res) {
        scopeValidator(["read:store"], req, res, getMethodHandler);
      });
      break;
    case "PUT":
      schemaValidator("modelId", "query", req, res, function (req, res) {
        schemaValidator("updateStore", "body", req, res, function (req, res) {
          scopeValidator(["update:store"], req, res, updateMethodHandler);
        });
      });
      break;
    case "DELETE":
      schemaValidator("modelId", "query", req, res, function (req, res) {
        scopeValidator(["disable:store"], req, res, deleteMethodHandler);
      });
      break;
    default:
      errorHandler(
        boom.methodNotAllowed(
          "This endpoint only accepts GET, PUT and DELETE requests"
        ),
        req,
        res
      );
  }
});