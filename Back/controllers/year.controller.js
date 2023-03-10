//REQUIRES//
const { response } = require("express");
const bcrypt = require("bcryptjs");
const Year = require("../models/year.model");

//FUNCTIONS//
const getYears = async(req, res = response) => {
    // const { limitMin = 0, limitMax = 5 } = req.query;
    const query = { estado: true };
    const [total, year] = await Promise.all([
        Year.countDocuments(query),
        Year.find(query),
        // Year.find(query).skip(Number(limitMin)),
    ]);

    res.json({
        count: total,
        info_: year,
    });
};
const createYear = async(req, res) => {
    const query = { estado: true };
    const year = req.body.year;
    const [total, yearExists] = await Promise.all([
        Year.countDocuments(query),
        Year.findOne({ year }),
    ]);
    console.log("year-->", year);
    console.log("yearExists-->", yearExists);

    const any = new Year({
        total,
        year,
    });
    if (yearExists) {
        return console.log({
            error: "Este año ya existe",
        });
    } else {
        any.save();
        console.log({
            message: "Year created succesfully",
            info: any,
            count: total,
        });
    }
    //grabar
};
const deleteYear = async(req, res = response) => {
    const { id } = req.params;
    const deleted = await Year.findByIdAndDelete(id); //Borrar user de la bdd
    //No borrem, l'usuari sino que li canviem l'estat
    //const deleted = await Movement.findByIdAndUpdate(id, { estado: false });

    res.json({
        info: deleted,
    });
};
const getYear = async(req, res = response) => {
    const id = req.params.id;

    const [total, year] = await Promise.all([
        Year.countDocuments(),
        Year.findById(id),
    ]);

    res.json({
        count: total,
        info_: year,
    });
};

module.exports = {
    getYears,
    createYear,
    deleteYear,
    getYear,
};