import { Request, Response } from "express";
import Joi from "joi";
import { db } from "../db";
import { buildIncrementCode } from "../helpers/buildIncrementCode";
import {
  queryDeleteTrip,
  queryGetDetailTrip,
  queryGetTrips,
  queryGetTripsByKeyword,
  queryInsertTrip,
} from "../models/trip";
import {
  queryGetImageByImageCode,
  queryGetImageCodeByLastData,
  queryInsertTripImage,
} from "../models/tripImage";

export const addTrip = async (req: Request, res: Response) => {
  const {
    title,
    country_id,
    accomodation,
    transportation,
    eat,
    day,
    night,
    price,
    quota,
    max_quota,
    description,
  } = req.body;

  const { trip_images } = req.files as { [fieldname: string]: Express.Multer.File[] };

  const schema = Joi.object({
    title: Joi.string().max(50).required(),
    country_id: Joi.number().required(),
    accomodation: Joi.string().max(30).required(),
    transportation: Joi.string().max(30).required(),
    eat: Joi.string().max(30).required(),
    day: Joi.number().required(),
    night: Joi.number().required(),
    price: Joi.number().required(),
    quota: Joi.number().required(),
    max_quota: Joi.number().required(),
    description: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const checkTripImage = await db.oneOrNone(queryGetImageCodeByLastData);

    let incrementImageCode;
    if (checkTripImage) {
      incrementImageCode = buildIncrementCode(
        process.env.PREFIX_IMAGE_CODE,
        checkTripImage.trip_image_code
      );
    } else {
      incrementImageCode = `${process.env.PREFIX_IMAGE_CODE}00001`;
    }

    for await (const trip_image of trip_images) {
      await db.none(queryInsertTripImage, [incrementImageCode, trip_image.filename]);
    }

    await db.none(queryInsertTrip, [
      title,
      country_id,
      accomodation,
      transportation,
      eat,
      day,
      night,
      price,
      quota,
      max_quota,
      description,
      incrementImageCode,
    ]);

    res.status(201).send({
      status: "Success",
      message: "Success add trip",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

export const getTrips = async (req: Request, res: Response) => {
  const { keyword } = req.query;

  try {
    let data;
    if (keyword) {
      const trips = await db.manyOrNone(queryGetTripsByKeyword, [`%${keyword}%`]);

      data = await Promise.all(
        trips.map(async (trip) => {
          const tripImages = await db.many(queryGetImageByImageCode, trip.trip_image_code);

          const trip_images = tripImages.map((tripImage) => ({
            ...tripImage,
            trip_image_url: `${process.env.BASE_URL}${tripImage.trip_image_name}`,
          }));

          return { ...trip, trip_images };
        })
      );
    } else {
      const trips = await db.manyOrNone(queryGetTrips);

      data = await Promise.all(
        trips.map(async (trip) => {
          const tripImages = await db.many(queryGetImageByImageCode, trip.trip_image_code);

          const trip_images = tripImages.map((tripImage) => ({
            ...tripImage,
            trip_image_url: `${process.env.BASE_URL}${tripImage.trip_image_name}`,
          }));

          return { ...trip, trip_images };
        })
      );
    }

    res.status(200).send({
      status: "Success",
      message: "Success get all trip",
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

export const getTrip = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    let data = await db.one(queryGetDetailTrip, [id]);

    const trip_images = await db.many(queryGetImageByImageCode, [data.trip_image_code]);

    data.trip_images = trip_images.map((trip_image) => ({
      ...trip_image,
      trip_image_url: `${process.env.BASE_URL}${trip_image.trip_image_name}`,
    }));

    res.status(200).send({
      status: "Success",
      message: "Success get detail trip",
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

export const deleteTrip = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.none(queryDeleteTrip, [id]);

    res.status(200).send({
      status: "Success",
      message: "Success delete trip",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};
