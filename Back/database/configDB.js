const mongoose = require("mongoose");

const dbConnection = async() => {
    const env = "mongodb://localhost:27017/gestor";

    try {
        await mongoose.connect(env);
        console.log("Database Online");
    } catch (err) {
        throw new Error("Error al iniciar la base de datos");
    }
};

module.exports = {
    dbConnection,
};