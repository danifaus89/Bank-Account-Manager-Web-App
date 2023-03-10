//REQUIRES//
const { response } = require("express");
var mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const Movement = require("../models/movement.model");
const Month = require("../models/month.model");
const Year = require("../models/year.model");
const Saldo = require("../models/saldo.model");
const { createYear } = require("../controllers/year.controller");
//FUNCTIONS//
const getMove = async(req, res = response) => {
    const id = req.params.id;
    const [total, move] = await Promise.all([
        Movement.countDocuments(),
        Movement.findById(id),
    ]);
    res.json({
        count: total,
        info_: move,
    });
};
const getMovements = async(req, res = response) => {
    const { limitMin = 0, limitMax = 5 } = req.query;
    const query = { estado: true };
    const [total, movements] = await Promise.all([
        Movement.countDocuments(query),
        Movement.find(query).skip(Number(limitMin)),
    ]);
    res.json({
        count: total,
        info_: movements,
    });
};
const createMovement = async(req, res) => {
    const query = { estado: true };
    const monthName = req.body.mes;
    const saldo = await Saldo.findOne(query);
    const { concepte, tipus, date, ...rest } = req.body.form;
    const [total, moveExists, month] = await Promise.all([
        Movement.countDocuments(query),
        Movement.findOne({ concepte }),
        Month.findOne({ month: monthName }),
    ]);

    const monthID = month._id;
    const moveYear = date.substring(0, 4);
    const yearExists = await Year.findOne({ year: moveYear });
    const saldoID = saldo.id;

    if (!yearExists) {
        createYear(moveYear);
        const move = new Movement({
            concepte: concepte,
            import: formatDecimal(req.body.form.import),
            date: date,
            tipus: tipus,
            descripcio: req.body.form.descripcio,
            total: total,
            monthID: monthID,
            moveYear: moveYear,
            ...rest,
        });
        await move.save();
        res.json({
            message: "Move created succesfully",
            info: move,
            count: total,
        });
    }
    if (yearExists) {
        if (!ObjectId.isValid(monthID)) {
            res.json({
                message: "ID no valida",
            });
        } else {
            const move = new Movement({
                moveYear,
                monthID,
                total,
                concepte,
                tipus,
                date,
                ...rest,
            });
            updateSaldo(tipus, saldo, move, saldoID);
            await move.save();
            res.json({
                message: "Move created succesfully",
                info: move,
                count: total,
            });
        }
    }

    if (!ObjectId.isValid(monthID)) {
        return res.json({
            mssg: "La id del mes no es valida",
        });
    }
};
const modifyMovement = async(req, res = response) => {
    const id = req.params.id;
    const saldo = await Saldo.findOne({ estado: true });
    const saldoID = saldo.id;
    const tipusP = req.body.tipus;
    const { _id, concepte, imprt, tipus, date, descripcio, ...rest } = req.body;
    const move = await Movement.findByIdAndUpdate(id, rest);
    updateSaldo(tipusP, saldo, move, saldoID);
    res.json({
        message: "Modify method",
        oldMove: move,
        newMove: rest,
    });
};
const deleteMovement = async(req, res = response) => {
    const { id } = req.params;
    const move = await Movement.findById(id);
    const saldo = await Saldo.findOne({ estado: true });
    const saldoID = saldo._id;
    const imprt = move.import;
    const tipus = move.tipus;

    if (tipus === "pagament") {
        let saldoActual = formatDecimal(saldo.quantitat);
        let importMov = formatDecimal(imprt);
        let saldoRestant = saldoActual + importMov;
        let saldoUpdated = await Saldo.findOne({ _id: saldoID });
        await Movement.findByIdAndDelete(id); //Borrar moviment de la bdd
        await Saldo.updateOne({ _id: saldoID }, { quantitat: saldoRestant });
        await saldoUpdated.save();
    }
    if (tipus === "cobrament") {
        let saldoActual = formatDecimal(saldo.quantitat);
        let importMov = formatDecimal(imprt);
        let saldoRestant = saldoActual - importMov;
        let saldoUpdated = await Saldo.findOne({ _id: saldoID });
        await Movement.findByIdAndDelete(id); //Borrar moviment de la bdd
        await Saldo.updateOne({ _id: saldoID }, { quantitat: saldoRestant });
        await saldoUpdated.save();
    }
};

// PRIVATE //
async function updateSaldo(tipus, saldo, move, saldoID) {
    if (tipus === "pagament") {
        let saldoActual = formatDecimal(saldo.quantitat);
        let importMov = formatDecimal(move.import);
        let saldoRestant = saldoActual - importMov;
        let saldoUpdated = await Saldo.findOne({ _id: saldoID });
        await Saldo.updateOne({ _id: saldoID }, { quantitat: saldoRestant });
        await saldoUpdated.save();
    }
    if (tipus === "cobrament") {
        let saldoActual = formatDecimal(saldo.quantitat);
        let importMov = formatDecimal(move.import);
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
    getMove,
    getMovements,
    createMovement,
    modifyMovement,
    deleteMovement,
};