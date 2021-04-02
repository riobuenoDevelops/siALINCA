import boom from "@hapi/boom";
import { errorHandler } from "../../../../utils/handlers/index";
import authenticated from "../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import ApplicantService from "../../../../services/Applicant";

async function postMethodHandler(req, res) {
  try {
    res
      .status(200)
      .json(await ApplicantService.createApplicant({ applicant: req.body }));
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function getMethodHandler(req, res) {
  const {
    query: { cedula, phone, disabled },
  } = req;
  try {
    res.status(200).json(
      await ApplicantService.getApplicants({
        cedula,
        phone,
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
      scopeValidator(["read:applicant"], req, res, getMethodHandler);
      break;
    case "POST":
      schemaValidator("applicant", "body", req, res, (req, res) => {
        scopeValidator(["create:applicant"], req, res, postMethodHandler);
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
