import boom from "@hapi/boom";
import { errorHandler } from "../../../../utils/handlers/index";
import AuthService from "../../../../services/Auth";

export default async function handler(req, res) {
  debugger;
  const { method } = req;

  if (method === "POST") {
    const {
      body: { email, password },
    } = req;

    try {
      const token = await AuthService.login({ email, password });
      res.status(200).json(token);
    } catch (err) {
      errorHandler(boom.internal(err), req, res);
    }
  } else {
    errorHandler(
      boom.methodNotAllowed("This endpoint only accepts POST requests"),
      req,
      res
    );
  }
}
