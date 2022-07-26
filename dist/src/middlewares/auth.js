"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const auth = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).send({
            status: "Unauthorized",
            message: "No token in header, unauthorized user",
        });
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY || constants_1.tokenKey);
        req.user = verified;
        next();
    }
    catch (error) {
        return res.status(400).send({
            status: "Unauthorized",
            message: "Invalid token, unauthorized user",
        });
    }
};
exports.auth = auth;
const adminOnly = (req, res, next) => {
    if (req.user.role && req.user.role === "admin") {
        next();
        return;
    }
    res.status(403).send({
        status: "Failed",
        message: "forbidden",
    });
};
exports.adminOnly = adminOnly;
