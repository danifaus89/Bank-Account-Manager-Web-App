const { Router } = require("express");
const { deleteMovements } = require("../controllers/movements.controller");
const movementsRouter = Router();

//MOVEMENTS
movementsRouter.post("/", deleteMovements);

module.exports = movementsRouter;