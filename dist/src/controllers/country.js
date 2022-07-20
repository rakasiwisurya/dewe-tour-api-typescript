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
exports.getCountries = exports.addCountry = void 0;
const joi_1 = __importDefault(require("joi"));
const db_1 = require("../db");
const country_1 = require("../models/country");
const addCountry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { country_name } = req.body;
    const schema = joi_1.default.object({
        country_name: joi_1.default.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).send({
            status: "Failed",
            message: error.details[0].message,
        });
    }
    try {
        const isCountryExist = yield db_1.db.one(country_1.queryGetCountry, [country_name]);
        if (isCountryExist) {
            return res.status(400).send({
                status: "Failed",
                message: "Country already exist",
            });
        }
        const data = yield db_1.db.one(country_1.queryInsertCountry, [country_name]);
        res.status(201).send({
            status: "Success",
            message: "Success add country",
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
exports.addCountry = addCountry;
const getCountries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield db_1.db.many(country_1.queryGetCountries);
        res.status(200).send({
            status: "Success",
            message: "Success get countries",
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
exports.getCountries = getCountries;
