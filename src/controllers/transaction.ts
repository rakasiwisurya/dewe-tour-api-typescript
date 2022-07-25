import { Request, Response } from "express";
import Joi from "joi";
import moment from "moment-timezone";
import { db } from "../db";
import { buildIncrementCode } from "../helpers/buildIncrementCode";
import { cloudinary } from "../libraries/cloudinary";
import {
  queryApproveTransaction,
  queryCountTransactions,
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
import { queryGetImageByImageCode } from "../models/tripImage";

interface QueryGetTransactions {
  keyword?: string;
  current_page?: number;
  limit?: number | null;
}

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

  if (!req.file) {
    return res.status(400).send({
      status: "Failed",
      message: "No upload file",
    });
  }

  try {
    const cloudinary_upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "/dewe_tour/proofs",
      use_filename: true,
      unique_filename: false,
    });

    await db.none(queryUpdateProofPayment, [
      id,
      "WAITING_APPROVE",
      "Waiting Approve",
      proofPaymentDate,
      cloudinary_upload.public_id,
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
  let { keyword, current_page, limit }: QueryGetTransactions = req.query;

  const schema = Joi.object({
    keyword: Joi.string().optional(),
    current_page: Joi.number().optional(),
    limit: Joi.number().optional(),
  });

  const { error } = schema.validate(req.query);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  if ((!current_page && limit) || (current_page && !limit)) {
    return res.status(400).send({
      status: "Failed",
      message: "Can't set current_page or limit only, set both of current_page and limit instead",
    });
  }

  const offset = current_page && limit ? (current_page - 1) * limit : 0;
  if (!keyword) keyword = "";
  if (!limit) limit = null;

  try {
    const totalRecord = await db.oneOrNone(queryCountTransactions, [`%${keyword}%`]);

    const transactions = await db.manyOrNone(queryGetTransactions, [`%${keyword}%`, offset, limit]);

    const data = transactions.map((transaction) => ({
      ...transaction,
      proof_payment_url: transaction.proof_payment
        ? cloudinary.url(transaction.proof_payment)
        : `${process.env.BASE_URL_UPLOAD}/proofs/no-image.png`,
    }));

    if (!current_page) current_page = 1;
    const newLimit = limit ? limit : totalRecord.count;
    const startIndex = (current_page - 1) * newLimit;
    const endIndex = current_page * newLimit;
    const hasNext = endIndex < totalRecord.count ? true : false;
    const hasPrev = startIndex > 0 ? true : false;

    res.status(200).send({
      status: "Success",
      message: "Success get all transaction",
      data: {
        current_page: +current_page,
        total_record: totalRecord.count,
        has_next: hasNext,
        has_prev: hasPrev,
        records: data,
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

export const getTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const transaction = await db.oneOrNone(queryGetTransaction, [id]);

    if (!transaction) {
      return res.status(200).send({
        status: "Success",
        message: "Success get detail transaction",
        data: transaction,
      });
    }

    const data = {
      ...transaction,
      date_trip: moment(transaction.date_trip).format("YYYY-MM-DD"),
      proof_payment_url: transaction.proof_payment
        ? cloudinary.url(transaction.proof_payment)
        : `${process.env.BASE_URL_UPLOAD}/proofs/no-image.png`,
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
  const { offset, limit } = req.query;

  const schema = Joi.object({
    offset: Joi.number().optional(),
    limit: Joi.number().optional(),
  });

  const { error } = schema.validate(req.query);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  const newoffset = offset ? offset : 0;
  const newLimit = limit ? limit : null;

  try {
    const incomeTrips = await db.manyOrNone(queryIncomeTrip, [newoffset, newLimit]);

    if (!incomeTrips.length) {
      return res.status(200).send({
        status: "Success",
        message: "Success get income transaction",
        data: incomeTrips,
      });
    }

    const data = await Promise.all(
      incomeTrips.map(async (incomeTrip) => {
        const tripImages = await db.many(queryGetImageByImageCode, [incomeTrip.trip_image_code]);

        return {
          ...incomeTrip,
          trip_image_url: cloudinary.url(tripImages[0].trip_image_name),
        };
      })
    );

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
    const transaction = await db.oneOrNone(queryGetTransaction, [id]);

    if (!transaction) {
      return res.status(200).send({
        status: "Failed",
        message: "Data doesn't exist",
      });
    }

    await cloudinary.uploader.destroy(transaction.proof_payment);

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
