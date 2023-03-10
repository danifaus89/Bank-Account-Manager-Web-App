const Role = require("../models/role.model");
const User = require("../models/user.model");
const Move = require("../models/movement.model");
const Year = require("../models/year.model");
const Month = require("../models/month.model");
const Saldo = require("../models/saldo.model");

const validRole = async(rol = "") => {
    const rolExist = await Role.findOne({ rol });
    if (!rolExist) {
        throw new Error(`El rol ${rol} no existe en la Bdd`);
    }
};
const emailExist = async(email = "") => {
    const emailExist = await User.findOne({ email });
    if (emailExist) {
        throw new Error(`Este email ${email} ya esta registrado`);
    }
};
const idUserExist = async(id) => {
    const idUserExist = await User.findById(id);
    if (!idUserExist) {
        throw new Error(`El id ${email} no existe`);
    }
};
const idMove = async(id) => {
    const idMoveExist = await Move.findById(id);
    if (!idMoveExist) {
        throw new Error(`El id ${id} no existe`);
    }
};
const idYear = async(id) => {
    const idExist = await Year.findById(id);
    if (!idExist) {
        throw new Error(`El id ${id} no existe`);
    }
};
const idMonth = async(id) => {
    const idExist = await Month.findById(id);
    if (!idExist) {
        throw new Error(`El id ${id} no existe`);
    }
};
const idSaldo = async(id) => {
    const idExist = await Saldo.findById(id);
    if (!idExist) {
        throw new Error(`El id ${id} no existe`);
    }
};

module.exports = {
    validRole,
    emailExist,
    idUserExist,
    idMove,
    idYear,
    idMonth,
    idSaldo,
};