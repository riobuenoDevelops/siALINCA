import boom from "@hapi/boom";
import { errorHandler } from "../../../../utils/handlers/index";
import authenticated from "../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import ItemService from "../../../../services/Item";

async function postMethodHandler(req, res) {
  try {
    await ItemService.createInventoryReport({ path: req.body.path });
    res.status(200).send();
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

export default authenticated(async function (req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      scopeValidator(["read:item"], req, res, postMethodHandler);
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
