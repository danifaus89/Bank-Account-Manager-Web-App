const { Router } = require("express");
const { check } = require("express-validator");
const { validate } = require("../middlewares/validation.middleware");
const {
    getYears,
    getYear,
    createYear,
    deleteYear,
} = require("../controllers/year.controller");
const { idYear, idMonth } = require("../helpers/db-validators");
const yearRouter = Router();

//YEARS
yearRouter.get("/", getYears);
yearRouter.get(
    "/:id", [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(idYear),
        validate,
    ],
    getYear
);
yearRouter.post("/", createYear);
yearRouter.delete(
    "/:id", [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(idYear),
        validate,
    ],
    deleteYear
);

module.exports = yearRouter;