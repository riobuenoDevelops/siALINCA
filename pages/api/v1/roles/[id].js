import boom from "@hapi/boom";
import { errorHandler } from "../../../../utils/handlers/index";
import authenticated from "../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import RoleService from "../../../../services/Role";

async function getMethodHandler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    const role = await RoleService.getRole({ id });
    res.status(200).json(role);
  } catch (err) {
    errorHandler(boom.internal(err), req, res);
  }
}

async function updateMethodHandler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    const updatedRoleId = await RoleService.updateRole({ id, role: req.body });
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
    const deletedRoleId = await RoleService.deleteRole({ id });
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
        scopeValidator(["read:role"], req, res, getMethodHandler);
      });
      break;
    case "PUT":
      schemaValidator("modelId", "query", req, res, function (req, res) {
        schemaValidator("updateRole", "body", req, res, function (req, res) {
          scopeValidator(["update:role"], req, res, updateMethodHandler);
        });
      });
      break;
    case "DELETE":
      schemaValidator("modelId", "query", req, res, function (req, res) {
        scopeValidator(["disable:role"], req, res, deleteMethodHandler);
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
