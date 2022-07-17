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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const db_1 = require("../db");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const queryUser = `
      SELECT
        fullname,
        email,
        phone,
        gender_id,
        address,
        avatar
      FROM
        users
      WHERE
        user_id = $1
    `;
        const data = yield db_1.db.one(queryUser, [id]);
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
