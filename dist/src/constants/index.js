"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseUrl = exports.tokenKey = void 0;
exports.tokenKey = "TStWZhXcYsGN5XsgJH3YBM04ca6qKA2Ch5ZSFS8E";
exports.databaseUrl = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
