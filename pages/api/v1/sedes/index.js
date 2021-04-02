import boom from "@hapi/boom";
import { errorHandler } from "../../../../utils/handlers/index";
import authenticated from "../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import SedeService from "../../../../services/Sede";

async function postMethodHandler(req, res) {
  try {
    res.status(200).json(await SedeService.createSede({ sede: req.body }));
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function getMethodHandler(req, res) {
  const {
    query: {
      name,
      addressCity,
      addressZipcode,
      addressState,
      addressCountry,
      disabled,
    },
  } = req;
  try {
    res.status(200).json(
      await SedeService.getSedes({
        name,
        addressCity,
        addressZipcode,
        addressState,
        addressCountry,
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
      scopeValidator(["read:sede"], req, res, getMethodHandler);
      break;
    case "POST":
      schemaValidator("sede", "body", req, res, (req, res) => {
        scopeValidator(["create:sede"], req, res, postMethodHandler);
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
