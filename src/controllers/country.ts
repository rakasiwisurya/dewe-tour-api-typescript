import { Request, Response } from "express";
import Joi from "joi";
import { db } from "../db";
import { queryGetCountries, queryGetCountry, queryInsertCountry } from "../models/country";

export const addCountry = async (req: Request, res: Response) => {
  const { country_name } = req.body;

  const schema = Joi.object({
    country_name: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const isCountryExist = await db.one(queryGetCountry, [country_name]);

    if (isCountryExist) {
      return res.status(400).send({
        status: "Failed",
        message: "Country already exist",
      });
    }

    const data = await db.one(queryInsertCountry, [country_name]);

    res.status(201).send({
      status: "Success",
      message: "Success add country",
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

export const getCountries = async (req: Request, res: Response) => {
  try {
    const data = await db.many(queryGetCountries);
    res.status(200).send({
      status: "Success",
      message: "Success get countries",
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
