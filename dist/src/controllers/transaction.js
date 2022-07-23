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
exports.deleteTransaction = exports.rejectTransaction = exports.approveTransaction = exports.getIncomeTransactions = exports.getTransaction = exports.getTransactions = exports.uploadProofPayment = exports.addTransaction = void 0;
const joi_1 = __importDefault(require("joi"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const db_1 = require("../db");
const buildIncrementCode_1 = require("../helpers/buildIncrementCode");
const transaction_1 = require("../models/transaction");
const trip_1 = require("../models/trip");
const addTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, trip_id, qty } = req.body;
    const schema = joi_1.default.object({
        user_id: joi_1.default.number().required(),
        trip_id: joi_1.default.number().required(),
        qty: joi_1.default.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({
            status: "Failed",
            message: error.details[0].message,
        });
    }
    try {
        const trip = yield db_1.db.oneOrNone(trip_1.queryGetDetailTrip, [trip_id]);
        if (qty > trip.quota) {
            return res.status(416).send({
                status: "Failed",
                message: "Quantity is over than available quota",
            });
        }
        const checkTransactionCode = yield db_1.db.oneOrNone(transaction_1.queryGetTransactionCodeByLastData);
        let incrementTransactionCode;
        if (checkTransactionCode) {
            incrementTransactionCode = (0, buildIncrementCode_1.buildIncrementCode)(process.env.PREFIX_TRANSACTION_CODE, checkTransactionCode.transaction_code);
        }
        else {
            incrementTransactionCode = `${process.env.PREFIX_TRANSACTION_CODE}00001`;
        }
        const total = qty * trip.price;
        yield db_1.db.none(transaction_1.queryInsertTransaction, [incrementTransactionCode, user_id, trip_id, qty, total]);
        yield db_1.db.none(trip_1.queryUpdateQuotaTrip, [trip_id, trip.quota - qty]);
        res.status(200).send({
            status: "Success",
            message: "Success add transaction",
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
exports.addTransaction = addTransaction;
const uploadProofPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const proofPaymentDate = (0, moment_timezone_1.default)(new Date()).format();
    try {
        yield db_1.db.none(transaction_1.queryUpdateProofPayment, [
            id,
            "WAITING_APPROVE",
            "Waiting Approve",
            proofPaymentDate,
            (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
        ]);
        res.status(200).send({
            status: "Success",
            message: "Success upload proof payment",
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
exports.uploadProofPayment = uploadProofPayment;
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { keyword, current_page, limit } = req.query;
    const schema = joi_1.default.object({
        keyword: joi_1.default.string().optional(),
        current_page: joi_1.default.number().optional(),
        limit: joi_1.default.number().optional(),
    });
    const { error } = schema.validate(req.query);
    if (error) {
        return res.status(400).send({
            status: "Failed",
            message: error.details[0].message,
        });
    }
    if ((!current_page && limit) || (current_page && !limit)) {
        return res.status(400).send({
            status: "Failed",
            message: "Can't set current_page or limit only, set both of current_page and limit instead",
        });
    }
    const offset = current_page && limit ? (current_page - 1) * limit : 0;
    if (!keyword)
        keyword = "";
    if (!limit)
        limit = null;
    try {
        const totalRecord = yield db_1.db.oneOrNone(transaction_1.queryCountTransactions, [`%${keyword}%`]);
        const transactions = yield db_1.db.manyOrNone(transaction_1.queryGetTransactions, [`%${keyword}%`, offset, limit]);
        const data = transactions.map((transaction) => (Object.assign(Object.assign({}, transaction), { proof_payment_url: `${process.env.BASE_URL_UPLOAD}/proofs/${transaction.proof_payment}` })));
        if (!current_page)
            current_page = 1;
        const newLimit = limit ? limit : totalRecord.count;
        const startIndex = (current_page - 1) * newLimit;
        const endIndex = current_page * newLimit;
        const hasNext = endIndex < totalRecord.count ? true : false;
        const hasPrev = startIndex > 0 ? true : false;
        res.status(200).send({
            status: "Success",
            message: "Success get all transaction",
            data: {
                current_page: +current_page,
                total_record: totalRecord.count,
                has_next: hasNext,
                has_prev: hasPrev,
                records: data,
            },
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
exports.getTransactions = getTransactions;
const getTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const transaction = yield db_1.db.oneOrNone(transaction_1.queryGetTransaction, [id]);
        const data = Object.assign(Object.assign({}, transaction), { date_trip: (0, moment_timezone_1.default)(transaction.date_trip).format("YYYY-MM-DD"), proof_payment_url: `${process.env.BASE_URL_UPLOAD}/proofs/${transaction.proof_payment}` });
        res.status(200).send({
            status: "Success",
            message: "Success get detail transaction",
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
exports.getTransaction = getTransaction;
const getIncomeTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield db_1.db.manyOrNone(transaction_1.queryIncomeTrip);
        res.status(200).send({
            status: "Success",
            message: "Success get income transaction",
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
exports.getIncomeTransactions = getIncomeTransactions;
const approveTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const adminActionDate = (0, moment_timezone_1.default)(new Date()).format();
    try {
        yield db_1.db.none(transaction_1.queryApproveTransaction, [id, "APPROVE", "Approve", adminActionDate]);
        res.status(200).send({
            status: "Success",
            message: "Success approve transaction",
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
exports.approveTransaction = approveTransaction;
const rejectTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const adminActionDate = (0, moment_timezone_1.default)(new Date()).format();
    try {
        yield db_1.db.none(transaction_1.queryRejectTransaction, [id, "REJECT", "Reject", adminActionDate]);
        res.status(200).send({
            status: "Success",
            message: "Success reject transaction",
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
exports.rejectTransaction = rejectTransaction;
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.db.none(transaction_1.queryDeleteTransaction, [id]);
        res.status(200).send({
            status: "Success",
            message: "Success delete transaction",
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
exports.deleteTransaction = deleteTransaction;
