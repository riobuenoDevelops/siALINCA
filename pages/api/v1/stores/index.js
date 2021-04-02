import boom from "@hapi/boom";
import { errorHandler } from "../../../../utils/handlers/index";
import authenticated from "../../../../utils/middleware/auth/authenticatedWrapper";
import scopeValidator from "../../../../utils/middleware/validationHandlers/scopeValidationMiddleware";
import schemaValidator from "../../../../utils/middleware/validationHandlers/schemaValidationMiddleware";
import StoreService from "../../../../services/Store";

async function postMethodHandler(req, res) {
  try {
    res
      .status(200)
      .json(await StoreService.createStore({ storeData: req.body }));
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
      await StoreService.getStores({
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
      scopeValidator(["read:store"], req, res, getMethodHandler);
      break;
    case "POST":
      schemaValidator("role", "body", req, res, (req, res) => {
        scopeValidator(["create:store"], req, res, postMethodHandler);
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
