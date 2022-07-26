import { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { tokenKey } from "../constants";
import { queryCheckEmail, queryInsertUser } from "../models/user";

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
    const userData = await db.oneOrNone(queryCheckEmail, [email]);

    if (userData) {
      return res.status(400).send({
        status: "Failed",
        message: "Email already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const data = await db.one(queryInsertUser, [
      fullname,
      email,
      hashedPassword,
      phone,
      gender_id,
      address,
      "user",
    ]);

    res.status(201).send({
      status: "Success",
      message: "Register Success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const queryCheckUser = `
      SELECT
        *
      FROM 
        users
      LEFT JOIN
        genders
      ON
        users.gender_id = genders.gender_id
      WHERE
        email = $1
    `;

    const user = await db.oneOrNone(queryCheckUser, [email]);

    if (!user) {
      return res.status(400).send({
        status: "Failed",
        message: "Email or password doesn't correct",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).send({
        status: "Failed",
        message: "Email or password doesn't correct",
      });
    }

    delete user.password;

    const token = jwt.sign(user, process.env.TOKEN_KEY || tokenKey, {
      expiresIn: "6h",
    });

    res.status(200).send({
      status: "Success",
      message: "Login success",
      data: {
        ...user,
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
