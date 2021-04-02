import boom from "@hapi/boom";
import { errorHandler } from "../../../../utils/handlers/index";
import authenticated from "../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import ItemService from "../../../../services/Item";

async function postMethodHandler(req, res) {
  try {
    res.status(200).json(await ItemService.createItem({ item: req.body }));
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function getMethodHandler(req, res) {
  const {
    query: { quantity, userId, disabled },
  } = req;
  try {
    const items = await ItemService.getItems({
      quantity,
      userId,
      disabled,
    });
    res.status(200).json(items);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

export default authenticated(async function (req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      scopeValidator(["read:item"], req, res, getMethodHandler);
      break;
    case "POST":
      schemaValidator("item", "body", req, res, (req, res) => {
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
