const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8080;
const { dbConnection } = require("../database/configDB");

class Server {
    constructor() {
        this.app = express();
        this.userEndPointPath = "/api/user";
        this.movementEndPointPath = "/api/movement";
        this.movementsEndPointPath = "/api/movements";
        this.yearEndPointPath = "/api/year";
        this.monthEndPointPath = "/api/month";
        this.saldoEndPointPath = "/api/saldo";

        //Conectar a BDD
        this.databaseConnect();
        //middlewares
        this.middlewares();
        //rutas app
        this.routes();
    }

    async databaseConnect() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //lectura y parseo body
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static("public"));
    }

    routes() {
        this.app.use(this.saldoEndPointPath, require("../routes/saldo.routes"));
        this.app.use(this.yearEndPointPath, require("../routes/year.routes"));
        this.app.use(this.monthEndPointPath, require("../routes/month.routes"));
        this.app.use(this.userEndPointPath, require("../routes/user.routes"));
        this.app.use(
            this.movementEndPointPath,
            require("../routes/movement.routes")
        );
        this.app.use(
            this.movementsEndPointPath,
            require("../routes/movements.routes")
        );
    }

    listen() {
        this.app.listen(port, () => {
            console.log(`Listening on ${port}`);
        });
    }
}

module.exports = Server;