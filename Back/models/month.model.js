const { Schema, model, Mongoose } = require("mongoose");

const MonthSchema = Schema({
    month: {
        type: String,
        required: [true, "El mes es obligatorio"],
    },
    yearID: {
        type: Schema.Types.ObjectId,
        ref: "Year",
        required: true,
    },
    yearNumber: {
        type: Number,
    },
});

module.exports = model("Month", MonthSchema);