import boom from "@hapi/boom";
import { errorHandler } from "../../../../utils/handlers/index";
import authenticated from "../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import RoleService from "../../../../services/Role";

async function postMethodHandler(req, res) {
  try {
    res.status(200).json(await RoleService.createRole({ role: req.body }));
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function getMethodHandler(req, res) {
  try {
    const roles = await RoleService.getRoles();
    res.status(200).json(roles);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      scopeValidator(["read:role"], req, res, getMethodHandler);
      break;
    case "POST":
      schemaValidator("role", "body", req, res, (req, res) => {
        scopeValidator(["create:role"], req, res, postMethodHandler);
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
}

export default authenticated(handler);
