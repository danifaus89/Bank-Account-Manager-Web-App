//REQUIRES//
const { response } = require("express");
const Saldo = require("../models/saldo.model");

//FUNCTIONS//
const getSaldo = async(req, res = response) => {
    const query = { estado: true };
    const saldo = await Promise.all([Saldo.find(query)]);

    res.json({
        info_: saldo,
    });
};
const createSaldo = async(req, res) => {
    const { quantitat } = req.body;
    const query = { estado: true };
    const [total, saldoExists] = await Promise.all([
        Saldo.countDocuments(query),
        Saldo.findOne({ quantitat }),
    ]);
    const saldo = new Saldo({
        quantitat,
        total,
    });
    if (saldoExists) {
        return console.log({
            error: "Ya se ha insertado el saldo inicial",
        });
    }
    //grabar
    saldo.save();
    console.log({
        message: "Saldo creado correctamente",
        info: saldo,
        count: total,
    });
};
const modifySaldo = async(req, res = response) => {
    const id = req.params.id;
    const quantitat = formatDecimal(req.body.saldo);
    let saldoUpdated = await Saldo.findOne({ _id: id });
    console.log("ModifySaldo/quantitat->" + quantitat);
    console.log("ModifySaldo/saldoUpdated->" + saldoUpdated);
    await Saldo.updateOne({ _id: id }, { quantitat: quantitat });
    await saldoUpdated.save();

    res.json({
        message: "Modify method",
        oldMoney: saldoUpdated,
        newMoney: quantitat,
    });
};
const deleteSaldo = async(req, res = response) => {
    const { id } = req.params;
    const deleted = await Year.findByIdAndDelete(id); //Borrar user de la bdd
    //No borrem, l'usuari sino que li canviem l'estat
    //const deleted = await Movement.findByIdAndUpdate(id, { estado: false });

    res.json({
        info: deleted,
    });
};

//PRIVATE
function formatDecimal(n) {
    return Math.round(n * 100) / 100;
}

module.exports = {
    getSaldo,
    modifySaldo,
    createSaldo,
    deleteSaldo,
};