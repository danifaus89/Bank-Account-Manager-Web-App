//REQUIRES//
const { response } = require("express");
const ObjectId = require("mongoose").Types.ObjectId;
const Month = require("../models/month.model");
const Year = require("../models/year.model");
const Movement = require("../models/movement.model");
//FUNCTIONS//
const getMonths = async(req, res = response) => {
    // const { limitMin = 0, limitMax = 5 } = req.query;
    const query = { estado: true };
    const [total, month] = await Promise.all([
        Month.countDocuments(query),
        Month.find(query),
        // Year.find(query).skip(Number(limitMin)),
    ]);

    res.json({
        count: total,
        info_: month,
    });
};
const createMonth = async(req, res) => {
    const query = { estado: true };
    const { month, yearID } = req.body;

    const [total, monthExists, year] = await Promise.all([
        Month.countDocuments(query),
        Month.findOne({ month }),
        Year.findById(yearID),
    ]);
    const yearNumber = year.year;
    if (monthExists) {
        return res.status(400).json({
            error: "Este mes ya existe",
        });
    }
    if (!year) {
        return res.status(400).json({
            error: "Este año no existe",
        });
    }
    const mes = new Month({
        total,
        month,
        yearID,
        yearNumber,
    });
    //grabar
    mes.save();
    res.json({
        message: "Month created succesfully",
        infoMonth: mes,
        count: total,
    });
};
const deleteMonth = async(req, res = response) => {
    const { id } = req.params;
    const deleted = await Year.findByIdAndDelete(id); //Borrar user de la bdd
    //No borrem, l'usuari sino que li canviem l'estat
    //const deleted = await Movement.findByIdAndUpdate(id, { estado: false });

    res.json({
        info: deleted,
    });
};
const getMonth = async(req, res = response) => {
    const id = req.params.id;

    const [total, month] = await Promise.all([
        Month.countDocuments(),
        Month.findById(id),
    ]);

    res.json({
        count: total,
        info_: month,
    });
};
const getAllMonthsOfYear = async(req, res) => {
    const yearID = req.body.yearID;
    if (ObjectId.isValid(yearID)) {
        const query = { yearID: yearID };
        const [total, mes] = await Promise.all([
            Month.countDocuments(query),
            await Month.find({ yearID: yearID }),
        ]);
        res.json({
            count: total,
            info_: mes,
        });
    }
    if (!ObjectId.isValid(yearID)) {
        return res.json({
            mssg: "La id del año no es valida",
        });
    }
};
const getAllMovesOfMonth = async(req, res) => {
    const monthName = req.query.month;
    const moveYear = req.query.year;
    const month = await Month.find({ month: monthName });
    const monthID = month[0]._id;
    var [total, movements] = await Promise.all([
        Movement.countDocuments({ monthID: monthID, moveYear: moveYear }),
        Movement.find({ monthID: monthID, moveYear: moveYear }),
    ]);
    if (ObjectId.isValid(monthID)) {
        if (!movements) {
            return res.status(400).json({
                error: "La id del mes no existe",
            });
        } else if (total <= 0) {
            return res.status(200).json({
                error: "No existen movimientos en este mes",
            });
        } else {
            res.json({
                count: total,
                info_: movements,
            });
        }
    }
    if (!ObjectId.isValid(monthID)) {
        return res.json({
            mssg: "La id del mes no es valida",
        });
    }
};

// PRIVATE //

module.exports = {
    getMonths,
    createMonth,
    deleteMonth,
    getMonth,
    getAllMonthsOfYear,
    getAllMovesOfMonth,
};