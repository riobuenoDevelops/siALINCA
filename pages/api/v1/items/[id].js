import boom from "@hapi/boom";
import { errorHandler } from "../../../../utils/handlers/index";
import authenticated from "../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import ItemService from "../../../../services/Item";

async function getMethodHandler(req, res) {
  const {
    query: { id, withChild },
  } = req;

  try {
    const item = await ItemService.getItem({ id, withChild });
    res.status(200).json(item);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function updateMethodHandler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    const updatedItemId = await ItemService.updateItem({ id, item: req.body });
    res.status(200).json(updatedItemId);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function deleteMethodHandler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    const deletedItemId = await ItemService.deleteItem({ id });
    res.status(200).json(deletedItemId);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

export default authenticated(async function (req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      schemaValidator("modelId", "query", req, res, function (req, res) {
        scopeValidator(["read:item"], req, res, getMethodHandler);
      });
      break;
    case "PUT":
      schemaValidator("modelId", "query", req, res, function (req, res) {
        schemaValidator("updateItem", "body", req, res, function (req, res) {
          scopeValidator(["update:item"], req, res, updateMethodHandler);
        });
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
          "This endpoint only accepts GET, PUT and DELETE requests"
        ),
        req,
        res
      );
  }
});
