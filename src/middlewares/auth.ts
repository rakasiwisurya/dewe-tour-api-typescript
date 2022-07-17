import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { tokenKey } from "../constants";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      status: "Unauthorized",
      message: "No token in header, unauthorized user",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_KEY || tokenKey);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).send({
      status: "Unauthorized",
      message: "Invalid token, unauthorized user",
    });
  }
};
