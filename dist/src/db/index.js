"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const constants_1 = require("../constants");
const pgp = (0, pg_promise_1.default)({
/* Initialization Options */
});
exports.db = pgp(process.env.DATABASE_URL ? process.env.DATABASE_URL : constants_1.databaseUrl);
