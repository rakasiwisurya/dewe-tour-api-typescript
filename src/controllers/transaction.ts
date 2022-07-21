import { Request, Response } from "express";
import Joi from "joi";
import moment from "moment-timezone";
import { db } from "../db";
import { buildIncrementCode } from "../helpers/buildIncrementCode";
import {
  queryApproveTransaction,
  queryDeleteTransaction,
  queryGetTransaction,
  queryGetTransactionCodeByLastData,
  queryGetTransactions,
  queryIncomeTrip,
  queryInsertTransaction,
  queryRejectTransaction,
  queryUpdateProofPayment,
} from "../models/transaction";
import { queryGetDetailTrip, queryUpdateQuotaTrip } from "../models/trip";

export const addTransaction = async (req: Request, res: Response) => {
  const { user_id, trip_id, qty } = req.body;

  const schema = Joi.object({
    user_id: Joi.number().required(),
    trip_id: Joi.number().required(),
    qty: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const trip = await db.oneOrNone(queryGetDetailTrip, [trip_id]);

    if (qty > trip.quota) {
      return res.status(416).send({
        status: "Failed",
        message: "Quantity is over than available quota",
      });
    }

    const checkTransactionCode = await db.oneOrNone(queryGetTransactionCodeByLastData);

    let incrementTransactionCode;
    if (checkTransactionCode) {
      incrementTransactionCode = buildIncrementCode(
        process.env.PREFIX_TRANSACTION_CODE,
        checkTransactionCode.transaction_code
      );
    } else {
      incrementTransactionCode = `${process.env.PREFIX_TRANSACTION_CODE}00001`;
    }

    const total = qty * trip.price;

    await db.none(queryInsertTransaction, [incrementTransactionCode, user_id, trip_id, qty, total]);

    await db.none(queryUpdateQuotaTrip, [trip_id, trip.quota - qty]);

    res.status(200).send({
      status: "Success",
      message: "Success add transaction",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

export const uploadProofPayment = async (req: Request, res: Response) => {
  const { id } = req.params;

  const proofPaymentDate = moment(new Date()).format();

  try {
    await db.none(queryUpdateProofPayment, [
      id,
      "WAITING_APPROVE",
      "Waiting Approve",
      proofPaymentDate,
      req.file?.filename,
    ]);

    res.status(200).send({
      status: "Success",
      message: "Success upload proof payment",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await db.manyOrNone(queryGetTransactions);

    const data = transactions.map((transaction) => ({
      ...transaction,
      proof_payment_url: `${process.env.BASE_URL_UPLOAD}/proofs/${transaction.proof_payment}`,
    }));

    res.status(200).send({
      status: "Success",
      message: "Success get all transaction",
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

export const getTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const transaction = await db.oneOrNone(queryGetTransaction, [id]);

    const data = {
      ...transaction,
      date_trip: moment(transaction.date_trip).format("YYYY-MM-DD"),
      proof_payment_url: `${process.env.BASE_URL_UPLOAD}/proofs/${transaction.proof_payment}`,
    };

    res.status(200).send({
      status: "Success",
      message: "Success get detail transaction",
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

export const getIncomeTransactions = async (req: Request, res: Response) => {
  try {
    const data = await db.manyOrNone(queryIncomeTrip);
    res.status(200).send({
      status: "Success",
      message: "Success get income transaction",
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

export const approveTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;

  const adminActionDate = moment(new Date()).format();

  try {
    await db.none(queryApproveTransaction, [id, "APPROVE", "Approve", adminActionDate]);

    res.status(200).send({
      status: "Success",
      message: "Success approve transaction",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

export const rejectTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;

  const adminActionDate = moment(new Date()).format();

  try {
    await db.none(queryRejectTransaction, [id, "REJECT", "Reject", adminActionDate]);

    res.status(200).send({
      status: "Success",
      message: "Success reject transaction",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.none(queryDeleteTransaction, [id]);

    res.status(200).send({
      status: "Success",
      message: "Success delete transaction",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};
