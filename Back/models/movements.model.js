const { Schema, model } = require("mongoose");

const MovementsSchema = Schema({
    concepte: {
        type: String,
        required: [true, "El concepto es obligatorio"],
    },
    import: {
        type: Schema.Types.Decimal128,
    },
    date: {
        type: Date,
        required: [true, "La fecha es obligatoria"],
    },
    tipus: {
        type: String,
        required: [true, "El tipo de movimiento es obligatorio"],
    },
    descripcio: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    total: {
        type: Schema.Types.Decimal128,
        default: true,
    },
    monthID: {
        type: Schema.Types.ObjectId,
        ref: "Month",
        required: [true, "El id del mes es obligatorio"],
    },
    moveYear: {
        type: Number,
        ref: "Month",
        required: [true, "El año del movimiento es obligatorio"],
    },
});

module.exports = model("Movements", MovementsSchema);