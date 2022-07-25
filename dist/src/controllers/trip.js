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
exports.deleteTrip = exports.getTrip = exports.getTrips = exports.addTrip = void 0;
const joi_1 = __importDefault(require("joi"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const db_1 = require("../db");
const buildIncrementCode_1 = require("../helpers/buildIncrementCode");
const cloudinary_1 = require("../libraries/cloudinary");
const trip_1 = require("../models/trip");
const tripImage_1 = require("../models/tripImage");
const addTrip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const { title, country_id, accomodation, transportation, eat, day, night, price, quota, date_trip, description, } = req.body;
    const { trip_images } = req.files;
    if (!trip_images) {
        return res.status(400).send({
            status: "Failed",
            message: "No upload files",
        });
    }
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
        date_trip: joi_1.default.date().required(),
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
                const cloudinary_upload = yield cloudinary_1.cloudinary.uploader.upload(trip_image.path, {
                    folder: "/dewe_tour/trips",
                    use_filename: true,
                    unique_filename: false,
                });
                yield db_1.db.none(tripImage_1.queryInsertTripImage, [incrementImageCode, cloudinary_upload.public_id]);
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
            date_trip,
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
const getTrips = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { keyword, offset, limit } = req.query;
    const schema = joi_1.default.object({
        keyword: joi_1.default.string().optional(),
        offset: joi_1.default.number().optional(),
        limit: joi_1.default.number().optional(),
    });
    const { error } = schema.validate(req.query);
    if (error) {
        return res.status(400).send({
            status: "Failed",
            message: error.details[0].message,
        });
    }
    if (!keyword)
        keyword = "";
    if (!offset)
        offset = 0;
    if (!limit)
        limit = null;
    try {
        const trips = yield db_1.db.manyOrNone(trip_1.queryGetTrips, [`%${keyword}%`, offset, limit]);
        const data = yield Promise.all(trips.map((trip) => __awaiter(void 0, void 0, void 0, function* () {
            const tripImages = yield db_1.db.many(tripImage_1.queryGetImageByImageCode, trip.trip_image_code);
            const trip_images = tripImages.map((tripImage) => (Object.assign(Object.assign({}, tripImage), { trip_image_url: cloudinary_1.cloudinary.url(tripImage.trip_image_name) })));
            const date_trip = (0, moment_timezone_1.default)(trip.date_trip).format("YYYY-MM-DD");
            return Object.assign(Object.assign({}, trip), { trip_images, date_trip });
        })));
        res.status(200).send({
            status: "Success",
            message: "Success get all trip",
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
exports.getTrips = getTrips;
const getTrip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        let data = yield db_1.db.oneOrNone(trip_1.queryGetDetailTrip, [id]);
        if (!data) {
            return res.status(200).send({
                status: "Success",
                message: "Success get detail trip",
                data,
            });
        }
        const trip_images = yield db_1.db.many(tripImage_1.queryGetImageByImageCode, [data.trip_image_code]);
        data.date_trip = (0, moment_timezone_1.default)(data.date_trip).format("YYYY-MM-DD");
        data.trip_images = trip_images.map((trip_image) => (Object.assign(Object.assign({}, trip_image), { trip_image_url: cloudinary_1.cloudinary.url(trip_image.trip_image_name) })));
        res.status(200).send({
            status: "Success",
            message: "Success get detail trip",
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
exports.getTrip = getTrip;
const deleteTrip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var e_2, _b;
    const { id } = req.params;
    try {
        const trip = yield db_1.db.oneOrNone(trip_1.queryGetDetailTrip, [id]);
        if (!trip) {
            return res.status(400).send({
                status: "Failed",
                message: "Data doesn't exist",
            });
        }
        const tripImages = yield db_1.db.many(tripImage_1.queryGetImageByImageCode, [trip.trip_image_code]);
        try {
            for (var tripImages_1 = __asyncValues(tripImages), tripImages_1_1; tripImages_1_1 = yield tripImages_1.next(), !tripImages_1_1.done;) {
                const tripImage = tripImages_1_1.value;
                yield cloudinary_1.cloudinary.uploader.destroy(tripImage.trip_image_name);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (tripImages_1_1 && !tripImages_1_1.done && (_b = tripImages_1.return)) yield _b.call(tripImages_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        yield db_1.db.none(trip_1.queryDeleteTrip, [id]);
        res.status(200).send({
            status: "Success",
            message: "Success delete trip",
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
exports.deleteTrip = deleteTrip;
