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
exports.updateAvatar = exports.updateUser = exports.getUser = void 0;
const joi_1 = __importDefault(require("joi"));
const db_1 = require("../db");
const user_1 = require("../models/user");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const data = yield db_1.db.one(user_1.queryGetUser, [id]);
        res.status(200).send({
            status: "Success",
            message: "Sucess get detail user",
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
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, phone, address, gender_id } = req.body;
    const { id } = req.params;
    const schema = joi_1.default.object({
        fullname: joi_1.default.string().optional(),
        phone: joi_1.default.number().min(10).optional(),
        address: joi_1.default.string().min(10).optional(),
        gender_id: joi_1.default.number().optional(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({
            status: "Failed",
            message: error.details[0].message,
        });
    }
    try {
        yield db_1.db.none(user_1.queryUpdateUser, [id, fullname, phone, address, gender_id]);
        const data = yield db_1.db.one(user_1.queryGetUser, [id]);
        res.status(200).send({
            status: "Success",
            message: "Success update user",
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
exports.updateUser = updateUser;
const updateAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    try {
        yield db_1.db.none(user_1.queryUpdateAvatar, [id, (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename]);
        res.status(200).send({
            status: "Success",
            message: "Success update avatar",
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
exports.updateAvatar = updateAvatar;
