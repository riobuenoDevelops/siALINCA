import boom from "@hapi/boom";
import { errorHandler } from "../../../../utils/handlers/index";
import authenticated from "../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import DeliveryNoteService from "../../../../services/DeliveryNote";

async function postMethodHandler(req, res) {
  try {
    const createdNote = await DeliveryNoteService.createDeliveryNote({ deliveryNote: req.body });

    res
      .status(200)
      .json(createdNote);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function getMethodHandler(req, res) {
  try {

    const notes = await DeliveryNoteService.getDeliveryNotes({ ...req.query })
    res.status(200).json(notes);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

export default authenticated(async function (req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      scopeValidator(["read:deliveryNote"], req, res, getMethodHandler);
      break;
    case "POST":
      schemaValidator("deliveryNote", "body", req, res, (req, res) => {
        scopeValidator(["create:deliveryNote"], req, res, postMethodHandler);
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
