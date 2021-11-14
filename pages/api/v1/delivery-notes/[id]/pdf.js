import boom from "@hapi/boom";
import { errorHandler } from "../../../../../utils/handlers";
import authenticated from "../../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import DeliveryNoteService from "../../../../../services/DeliveryNote";

async function postMethodHandler(req, res) {
  const {
    query: { id },
  } = req;
  const {
    body: {
      path
    }
  } = req;
  try {
    const deliveryNote = await DeliveryNoteService.getDeliveryNote({ id });
    await DeliveryNoteService.generatePDF({ deliveryNote: { ...deliveryNote, path } })
    res.status(200);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

export default authenticated(async function (req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      schemaValidator("modelId", "query", req, res, function (req, res) {
        scopeValidator(["read:deliveryNote"], req, res, postMethodHandler);
      });
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
