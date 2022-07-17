import { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../../db";

export const register = async (req: Request, res: Response) => {
  const { fullname, email, password, phone, gender_id, address } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    fullname: Joi.string().required(),
    phone: Joi.number().min(10).required(),
    address: Joi.string().min(10).required(),
    gender_id: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const queryCheckEmail = "SELECT * FROM users WHERE email = $1";
    const userData = await db.oneOrNone(queryCheckEmail, [email]);

    if (userData) {
      return res.status(400).send({
        status: "Failed",
        message: "Email already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const queryInsertUser =
      "INSERT INTO users(fullname, email, password, phone, gender_id, address, role) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING user_id, fullname, email, phone, gender_id, address, role";
    const newUser = await db.one(queryInsertUser, [
      fullname,
      email,
      hashedPassword,
      phone,
      gender_id,
      address,
      "user",
    ]);

    const queryGenderByGenderId = "SELECT * FROM genders WHERE gender_id = $1";
    const gender = await db.one(queryGenderByGenderId, [newUser.gender_id]);

    delete newUser.gender_id;

    const tokeyKey = "TStWZhXcYsGN5XsgJH3YBM04ca6qKA2Ch5ZSFS8E";

    const token = jwt.sign(
      { ...newUser, gender: gender.gender_name },
      process.env.TOKEN_KEY || tokeyKey,
      {
        expiresIn: "6h",
      }
    );

    res.status(200).send({
      status: "Success",
      message: "Register Success",
      data: {
        ...newUser,
        gender: gender.gender_name,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};
