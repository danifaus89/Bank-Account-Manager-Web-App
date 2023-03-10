const { Router } = require("express");
const {
    getUsers,
    getUser,
    modifyUser,
    createUser,
    deleteUser,
} = require("../controllers/user.controller");
const userRouter = Router();
const { check } = require("express-validator");
const { validate } = require("../middlewares/validation.middleware");
const { validRole } = require("../helpers/db-validators");
const { emailExist, idUserExist } = require("../helpers/db-validators");

//USERS
userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);
userRouter.put(
    "/:id", [
        check("id", "No es un ID valido").isMongoId(),
        check("rol", "Rol no valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
        check("id").custom(idUserExist),

        validate,
    ],
    modifyUser
);
userRouter.post(
    "/", [
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("surname", "El apellido es obligatorio").not().isEmpty(),
        check("password", "La contraseña es obligatoria").not().isEmpty(),
        check("rol", "Rol no valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
        check("email").custom(emailExist),
        // check("rol").custom(validRole),
        // check("email", "Email no válido").isEmail(),
        validate,
    ],
    createUser
);
userRouter.delete(
    "/:id", [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(idUserExist),
        validate,
    ],
    deleteUser
);

module.exports = userRouter;