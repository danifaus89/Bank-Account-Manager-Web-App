//REQUIRES//
const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
////

//FUNCTIONS//

const getUsers = async(req, res = response) => {
    const { limitMin = 0, limitMax = 5 } = req.query;
    const query = { estado: true };
    // const users = await User.find(query).skip(Number(limitMin)).limit(limitMax);
    // const total = await User.countDocuments(query);

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query).skip(Number(limitMin)).limit(limitMax),
    ]);

    res.json({
        count: total,
        info_: users,
    });
};

const getUser = (req, res = response) => {
    const params = req.params;

    res.json({
        message: "Get user method",
        info: params,
    });
};

const createUser = async(req, res) => {
    const { name, surname, email, password, rol } = req.body;
    const user = new User({ name, surname, email, password, rol });
    const emailExists = await User.findOne({ email });

    //si correo existe
    if (emailExists) {
        return res.status(400).json({
            error: "Email ya registrado",
        });
    }
    //encriptar pass
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);
    //grabar
    user.save();
    res.json({
        message: "Create method",
        info: user,
    });
};

const modifyUser = async(req, res = response) => {
    const id = req.params.id;
    const { _id, password, email, google, ...rest } = req.body;

    if (password) {
        const salt = bcrypt.genSaltSync(10);
        rest.password = bcrypt.hashSync(password, salt);
    }
    const userUpdated = await User.findByIdAndUpdate(id, rest);

    res.json({
        message: "Modify method",
        newUser: rest,
        oldUser: userUpdated,
    });
};

const deleteUser = async(req, res = response) => {
    const { id } = req.params;

    //const deletedUser = await User.findByIdAndDelete(id); Borrar user de la bdd

    //No borrem, l'usuari sino que li canviem l'estat
    const deletedUser = await User.findByIdAndUpdate(id, { estado: false });

    res.json({
        info: deletedUser,
    });
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    modifyUser,
    deleteUser,
};