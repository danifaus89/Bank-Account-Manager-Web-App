const { Schema, model } = require("mongoose");

const SaldoSchema = Schema({
    quantitat: {
        type: Schema.Types.Decimal128,
        required: [true, "El saldo es obligatorio"],
    },
});

module.exports = model("Saldo", SaldoSchema);