import boom from "@hapi/boom";
import { errorHandler } from "../../../../utils/handlers/index";
import authenticated from "../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import DeliveryNoteService from "../../../../services/DeliveryNote";

async function postMethodHandler(req, res) {
  try {
    res
      .status(200)
      .json(
        await DeliveryNoteService.createDeliveryNote({ deliveryNote: req.body })
      );
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function getMethodHandler(req, res) {
  const {
    query: {
      createStamp,
      returnStamp,
      noteType,
      applicantType,
      applicantId,
      disabled,
    },
  } = req;
  try {
    res.status(200).json(
      await DeliveryNoteService.getDeliveryNotes({
        createStamp,
        returnStamp,
        noteType,
        applicantType,
        applicantId,
        disabled,
      })
    );
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
