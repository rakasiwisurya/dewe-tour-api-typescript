import { Request, Response } from "express";
import { db } from "../db";

export const getUser = async (req: Request, res: Response) => {
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
    const data = await db.one(queryUser, [id]);

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
