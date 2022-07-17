"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const constants_1 = require("../constants");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password, phone, gender_id, address } = req.body;
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(5).required(),
        fullname: joi_1.default.string().required(),
        phone: joi_1.default.number().min(10).required(),
        address: joi_1.default.string().min(10).required(),
        gender_id: joi_1.default.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({
            status: "Failed",
            message: error.details[0].message,
        });
    }
    try {
        const queryCheckEmail = "SELECT * FROM users WHERE email = $1";
        const userData = yield db_1.db.oneOrNone(queryCheckEmail, [email]);
        if (userData) {
            return res.status(400).send({
                status: "Failed",
                message: "Email already exist",
            });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const queryInsertUser = `
      INSERT INTO users
        (fullname, email, password, phone, gender_id, address, role)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        user_id,
        fullname,
        email,
        phone,
        gender_id,
        address,
        role
    `;
        const data = yield db_1.db.one(queryInsertUser, [
            fullname,
            email,
            hashedPassword,
            phone,
            gender_id,
            address,
            "user",
        ]);
        res.status(200).send({
            status: "Success",
            message: "Register Success",
            data,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({
            status: "Failed",
            message: "Internal server error",
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({
            status: "Failed",
            message: error.details[0].message,
        });
    }
    try {
        const queryCheckUser = `
      SELECT
        *
      FROM 
        users
      LEFT JOIN
        genders
      ON
        users.gender_id = genders.gender_id
      WHERE
        email = $1
    `;
        const user = yield db_1.db.oneOrNone(queryCheckUser, [email]);
        const isValid = yield bcrypt_1.default.compare(password, user.password);
        if (!user || !isValid) {
            return res.status(400).send({
                status: "Failed",
                message: "Email or password doesn't correct",
            });
        }
        delete user.password;
        const token = jsonwebtoken_1.default.sign(user, process.env.TOKEN_KEY || constants_1.tokenKey, {
            expiresIn: "6h",
        });
        res.status(200).send({
            status: "Success",
            message: "Login success",
            data: Object.assign(Object.assign({}, user), { token }),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({
            status: "Failed",
            message: "Internal server error",
        });
    }
});
exports.login = login;
