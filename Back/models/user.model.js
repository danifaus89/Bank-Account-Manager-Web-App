const { Schema, model } = require("mongoose");

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    surname: {
        type: String,
        required: [true, "Los apellidos son obligatorios"],
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
    },
    rol: {
        type: String,
        required: true,
        // enum: ["ADMIN_ROLE", "USER_ROLE"],
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

module.exports = model("User", UserSchema);