//REQUIRES//
const { response } = require("express");
var mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const Movement = require("../models/movement.model");
const Month = require("../models/month.model");
const Year = require("../models/year.model");
const Saldo = require("../models/saldo.model");

//FUNCTIONS//

const deleteMovements = async(req, res = response) => {
    const arrayID = req.body;
    console.log(arrayID);
    for (let i = 0; i < arrayID.length; i++) {
        console.log("forLoop-->", arrayID[i].id);
        const move = await Movement.findById(arrayID[i].id);
        if (move) {
            console.log("move-->", move);
            const saldo = await Saldo.findOne({ estado: true });
            const saldoID = saldo._id;
            const imprt = move.import;
            const tipus = move.tipus;

            if (tipus === "pagament") {
                let saldoActual = formatDecimal(saldo.quantitat);
                let importMov = formatDecimal(imprt);
                let saldoRestant = saldoActual + importMov;
                console.log("saldoRestant-->", saldoRestant);
                let saldoUpdated = await Saldo.findOne({ _id: saldoID });
                await Movement.findByIdAndDelete(arrayID[i].id);
                await Saldo.updateOne({ _id: saldoID }, { quantitat: saldoRestant });
                await saldoUpdated.save();
            }
            if (tipus === "cobrament") {
                let saldoActual = formatDecimal(saldo.quantitat);
                let importMov = formatDecimal(imprt);
                let saldoRestant = saldoActual - importMov;
                console.log("saldoRestant-->", saldoRestant);
                let saldoUpdated = await Saldo.findOne({ _id: saldoID });
                await Movement.findByIdAndDelete(arrayID[i].id);
                await Saldo.updateOne({ _id: saldoID }, { quantitat: saldoRestant });
                await saldoUpdated.save();
            }
        } else {
            console.log("Move doesnt exist");
        }
    }
};

// PRIVATE //
async function updateSaldo(tipus, saldo, move, saldoID) {
    console.log("1-->", tipus);
    console.log("2-->", saldo);
    console.log("3-->", move);
    console.log("4-->", saldoID);
    if (tipus === "pagament") {
        let saldoActual = parseInt(saldo.quantitat);
        let importMov = parseInt(move.import);
        let saldoRestant = saldoActual - importMov;
        let saldoUpdated = await Saldo.findOne({ _id: saldoID });
        await Saldo.updateOne({ _id: saldoID }, { quantitat: saldoRestant });
        await saldoUpdated.save();
    }
    if (tipus === "cobrament") {
        let saldoActual = parseInt(saldo.quantitat);
        let importMov = parseInt(move.import);
        let saldoRestant = saldoActual + importMov;
        let saldoUpdated = await Saldo.findOne({ _id: saldoID });
        await Saldo.updateOne({ _id: saldoID }, { quantitat: saldoRestant });
        await saldoUpdated.save();
        await move.save();
    }
}

function formatDecimal(n) {
    return Math.round(n * 100) / 100;
}

module.exports = {
    deleteMovements,
};