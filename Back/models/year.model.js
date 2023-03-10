const { Schema, model } = require("mongoose");

const YearSchema = Schema({
    year: {
        type: Number,
        unique: true,
    },
});

module.exports = model("Year", YearSchema);