import boom from "@hapi/boom";
import { errorHandler } from "../../../../../utils/handlers";
import authenticated from "../../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import StoreService from "../../../../../services/Store";

async function postMethodHandler(req, res) {
  try {
    const {
      query: { id },
    } = req;

    const storeId = await StoreService.addItem({ id, items: req.body });

    res.status(200).json(storeId);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function putMethodHandler(req, res) {
  try {
    const {
      query: { id },
    } = req;

    const storeId = await StoreService.updateStoreItems({ id, items: req.body });

    res.status(200).json(storeId);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function getMethodHandler(req, res) {
  const { query: { id } } = req;
  try {
    const storeItems = await StoreService.getStoreItems({ id });
    res.status(200).json(storeItems);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

export default authenticated(async function (req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      scopeValidator(["read:store"], req, res, getMethodHandler);
      break;
    case "POST":
      scopeValidator(["update:store"], req, res, postMethodHandler);
      break;
    case "PUT":
      scopeValidator(["update:store"], req, res, putMethodHandler);
      break;
    default:
      errorHandler(
        boom.methodNotAllowed(
          "This endpoint only accepts GET, PUT requests"
        ),
        req,
        res
      );
  }
});
