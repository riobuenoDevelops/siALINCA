import boom from "@hapi/boom";
import { errorHandler } from "../../../../../utils/handlers/index";
import authenticated from "../../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import StoreService from "../../../../../services/Store";

async function postMethodHandler(req, res) {
  const {
    body: {
      originStoreId,
      destinationStoreId,
      itemId,
      quantity
    }
  } = req;
  try {
    res
      .status(200)
      .json(await StoreService.transferItemfromStoreToStore({ originStoreId, itemId, quantity, destinationStoreId }));
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

export default authenticated(async function (req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      scopeValidator(["read:store", "update:store"], req, res, postMethodHandler);
      break;
    default:
      errorHandler(
        boom.methodNotAllowed(
          "This endpoint only accepts POST requests"
        ),
        req,
        res
      );
  }
});
