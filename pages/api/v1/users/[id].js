import boom from "@hapi/boom";
import { errorHandler } from "../../../../utils/handlers/index";
import authenticated from "../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import UserService from "../../../../services/User";

async function getMethodHandler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    const user = await UserService.getUser({ id });
    res.status(200).json(user);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function updateMethodHandler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    const updatedRoleId = await UserService.updateUser({ id, user: req.body });
    res.status(200).json(updatedRoleId);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function deleteMethodHandler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    const deletedRoleId = await UserService.deleteUser({ id });
    res.status(200).json(deletedRoleId);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

export default authenticated(async function (req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      schemaValidator("modelId", "query", req, res, function (req, res) {
        scopeValidator(["read:user"], req, res, getMethodHandler);
      });
      break;
    case "PUT":
      schemaValidator("modelId", "query", req, res, function (req, res) {
        schemaValidator("updateUser", "body", req, res, function (req, res) {
          scopeValidator(["update:user"], req, res, updateMethodHandler);
        });
      });
      break;
    case "DELETE":
      schemaValidator("modelId", "query", req, res, function (req, res) {
        scopeValidator(["disable:user"], req, res, deleteMethodHandler);
      });
      break;
    default:
      errorHandler(
        boom.methodNotAllowed(
          "This endpoint only accepts GET, PUT and DELETE requests"
        ),
        req,
        res
      );
  }
});
