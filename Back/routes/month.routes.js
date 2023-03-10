const { Router } = require("express");
const { check } = require("express-validator");
const { validate } = require("../middlewares/validation.middleware");
const {
    getMonths,
    createMonth,
    deleteMonth,
    getMonth,
    getAllMonthsOfYear,
    getAllMovesOfMonth,
} = require("../controllers/month.controller");
const { idMonth } = require("../helpers/db-validators");
const { idYear } = require("../helpers/db-validators");

const monthRouter = Router();

//MONTHS
monthRouter.get("/", getMonths);
monthRouter.get("/monthsOfYear", getAllMonthsOfYear);
monthRouter.get("/movesOfMonth", getAllMovesOfMonth);
monthRouter.get(
    "/:id", [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(idMonth),
        validate,
    ],
    getMonth
);
monthRouter.post(
    "/", [check("month", "El mes es obligatorio").not().isEmpty(), validate],
    createMonth
);
monthRouter.delete(
    "/:id", [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(idMonth),
        validate,
    ],
    deleteMonth
);

module.exports = monthRouter;