const { Router } = require("express");
const { validate } = require("../middlewares/validation.middleware");
const { idMove } = require("../helpers/db-validators");
const {
    getMovements,
    createMovement,
    modifyMovement,
    deleteMovement,
    getMove,
} = require("../controllers/movement.controller");
const movementRouter = Router();
const { check } = require("express-validator");

//MOVEMENTS
movementRouter.get("/", getMovements);
movementRouter.get(
    "/:id", [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(idMove),
        validate,
    ],
    getMove
);
movementRouter.delete(
    "/:id", [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(idMove),
        validate,
    ],
    deleteMovement
);
movementRouter.put(
    "/:id", [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(idMove),
        validate,
    ],
    modifyMovement
);
movementRouter.post(
    "/",
    // [
    //     check("concepte", "El concepto es obligatorio").not().isEmpty(),
    //     check("tipus", "El tipo de movimiento es obligatorio").not().isEmpty(),
    //     check("date", "La fecha es obligatoria").not().isEmpty(),
    //     validate,
    // ],
    createMovement
);
module.exports = movementRouter;