"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const register = (req, res) => {
    const { fullname, email, password, phone, gender, address } = req.body;
    res.status(200).send({
        status: "Success",
        message: "Register Success",
        data: null,
    });
};
exports.register = register;
