import boom from "@hapi/boom";
import { errorHandler } from "../../../../../utils/handlers";
import authenticated from "../../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import StoreService from "../../../../../services/Store";

async function getHandler(req, res){
  const { query: { itemId } } = req;
  try {
    const itemStores = await StoreService.getStoresByItem({ id: itemId });
    res.status(200).json(itemStores);
  }catch(err){
    errorHandler(boom.internal(err), req, res);
  }
}

export default authenticated(async function(req, res){
  const { method } = req;

  switch (method){
    case "GET":
      scopeValidator(["read:store"], req, res, getHandler);
      break;
    default:
      errorHandler(
        boom.methodNotAllowed(
          "This endpoint only accepts GET requests"
        ),
        req,
        res
      );
  }
});