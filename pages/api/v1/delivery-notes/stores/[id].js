import boom from "@hapi/boom";
import { errorHandler } from "../../../../../utils/handlers";
import authenticated from "../../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import DeliveryNoteService from "../../../../../services/DeliveryNote";

async function getMethodHandler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    res.status(200).json(await DeliveryNoteService.getDeliveryNotesByStore({ storeId: id }));
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

export default authenticated(async function (req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      schemaValidator("modelId", "query", req, res, function (req, res) {
        scopeValidator(["read:deliveryNote"], req, res, getMethodHandler);
      });
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
