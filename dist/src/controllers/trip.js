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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTrip = void 0;
const joi_1 = __importDefault(require("joi"));
const db_1 = require("../db");
const buildIncrementCode_1 = require("../helpers/buildIncrementCode");
const trip_1 = require("../models/trip");
const tripImage_1 = require("../models/tripImage");
const addTrip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const { title, country_id, accomodation, transportation, eat, day, night, price, quota, max_quota, description, } = req.body;
    const { trip_images } = req.files;
    const schema = joi_1.default.object({
        title: joi_1.default.string().max(50).required(),
        country_id: joi_1.default.number().required(),
        accomodation: joi_1.default.string().max(30).required(),
        transportation: joi_1.default.string().max(30).required(),
        eat: joi_1.default.string().max(30).required(),
        day: joi_1.default.number().required(),
        night: joi_1.default.number().required(),
        price: joi_1.default.number().required(),
        quota: joi_1.default.number().required(),
        max_quota: joi_1.default.number().required(),
        description: joi_1.default.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({
            status: "Failed",
            message: error.details[0].message,
        });
    }
    try {
        const checkTripImage = yield db_1.db.oneOrNone(tripImage_1.queryGetImageCodeByLastData);
        let incrementImageCode;
        if (checkTripImage) {
            incrementImageCode = (0, buildIncrementCode_1.buildIncrementCode)(process.env.PREFIX_IMAGE_CODE, checkTripImage.trip_image_code);
        }
        else {
            incrementImageCode = `${process.env.PREFIX_IMAGE_CODE}00001`;
        }
        try {
            for (var trip_images_1 = __asyncValues(trip_images), trip_images_1_1; trip_images_1_1 = yield trip_images_1.next(), !trip_images_1_1.done;) {
                const trip_image = trip_images_1_1.value;
                yield db_1.db.none(tripImage_1.queryInsertTripImage, [incrementImageCode, trip_image.filename]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (trip_images_1_1 && !trip_images_1_1.done && (_a = trip_images_1.return)) yield _a.call(trip_images_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        yield db_1.db.none(trip_1.queryInsertTrip, [
            title,
            country_id,
            accomodation,
            transportation,
            eat,
            day,
            night,
            price,
            quota,
            max_quota,
            description,
            incrementImageCode,
        ]);
        res.status(201).send({
            status: "Success",
            message: "Success add trip",
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
exports.addTrip = addTrip;
