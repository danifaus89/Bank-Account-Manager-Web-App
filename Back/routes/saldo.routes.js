const { Router } = require("express");
const { check } = require("express-validator");
const { validate } = require("../middlewares/validation.middleware");
const { idSaldo } = require("../helpers/db-validators");
const {
    getSaldo,
    createSaldo,
    deleteSaldo,
    modifySaldo,
} = require("../controllers/saldo.controller");
const saldoRouter = Router();

//SALDO
saldoRouter.get("/", getSaldo);
saldoRouter.post("/", createSaldo);
saldoRouter.put(
    "/:id", [check("id", "No es un ID valido").isMongoId()],
    modifySaldo
);
saldoRouter.delete(
    "/:id", [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(idSaldo),
        validate,
    ],
    deleteSaldo
);

module.exports = saldoRouter;