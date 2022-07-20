"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildIncrementCode = void 0;
const buildIncrementCode = (prefix, data) => {
    return `${prefix}${String(+data.substring(5) + 1).padStart(5, "0")}`;
};
exports.buildIncrementCode = buildIncrementCode;
