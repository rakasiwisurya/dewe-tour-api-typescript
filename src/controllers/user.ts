import { Request, Response } from "express";
import Joi from "joi";
import { db } from "../db";
import { queryGetUser, queryUpdateUser } from "../models/user";

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const data = await db.one(queryGetUser, [id]);

    res.status(200).send({
      status: "Success",
      message: "Sucess get detail user",
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

export const updateUser = async (req: Request, res: Response) => {
  const { fullname, phone, address, gender_id } = req.body;
  const { id } = req.params;

  const schema = Joi.object({
    fullname: Joi.string().optional(),
    phone: Joi.number().min(10).optional(),
    address: Joi.string().min(10).optional(),
    gender_id: Joi.number().optional(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    await db.none(queryUpdateUser, [id, fullname, phone, address, gender_id]);

    const data = await db.one(queryGetUser, [id]);

    res.status(200).send({
      status: "Success",
      message: "Success update user",
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
