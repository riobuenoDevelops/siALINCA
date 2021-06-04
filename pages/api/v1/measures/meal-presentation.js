import boom from "@hapi/boom";
import { errorHandler } from "../../../../utils/handlers/index";
import authenticated from "../../../../utils/middleware/auth/authenticatedWrapper";
import MeasureService from "../../../../services/Measure";

export default authenticated(async function (req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const mark = await MeasureService.addMealPresentation({
          name: req.body.name,
        });
        res.status(200).json(mark);
      } catch (err) {
        errorHandler(boom.internal(err), req, res);
      }
      break;
    default:
      errorHandler(
        boom.methodNotAllowed("This endpoint only accepts POST requests"),
        req,
        res
      );
  }
});
