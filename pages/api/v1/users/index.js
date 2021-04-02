import boom from "@hapi/boom";
import { errorHandler } from "../../../../utils/handlers/index";
import authenticated from "../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import UserService from "../../../../services/User";

async function postMethodHandler(req, res) {
  try {
    res.status(200).json(await UserService.createUser({ userData: req.body }));
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function getMethodHandler(req, res) {
  const {
    query: { email, phone },
  } = req;

  try {
    const users = await UserService.getUsers({ email, phone });
    res.status(200).json(users);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

export default authenticated(async function (req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      scopeValidator(["read:user"], req, res, getMethodHandler);
      break;
    case "POST":
      schemaValidator("user", "body", req, res, (req, res) => {
        scopeValidator(["create:user"], req, res, postMethodHandler);
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
