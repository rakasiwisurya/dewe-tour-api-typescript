import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;

export const uploadFiles = (uploadedFilename: string, location: string) => {
  const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
      cb(null, location);
    },
    filename: (req: Request, file: Express.Multer.File, cb: FilenameCallback) => {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.fieldname === uploadedFilename) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|svg)$/)) {
        req.fileValidationError = {
          status: "Failed File Handler",
          message: "Only images file are allowed",
        };

        return cb(null, false);
      }

      cb(null, true);
    }
  };

  const sizeInMB = 10;
  const maxSize = sizeInMB * 1024 * 1024;
  const maxFiles = 4;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    {
      name: uploadedFilename,
      maxCount: maxFiles,
    },
  ]);

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (error) => {
      if (req.fileValidationError) return res.status(422).send(req.fileValidationError);

      if (error) {
        console.error(error);
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(422).send({
            status: "Failed File Handler",
            message: `Max file sized is ${sizeInMB}MB`,
          });
        }

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(422).send({
            status: "Failed File Handler",
            message: `Max file is ${maxFiles} files`,
          });
        }

        return res.status(422).send(error);
      }

      return next();
    });
  };
};

export const uploadFile = (uploadedFilename: string, location: string) => {
  const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
      cb(null, location);
    },
    filename: (req: Request, file: Express.Multer.File, cb: FilenameCallback) => {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.fieldname === uploadedFilename) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|svg)$/)) {
        req.fileValidationError = {
          status: "Failed File Handler",
          message: "Only images file are allowed",
        };

        return cb(null, false);
      }

      cb(null, true);
    }
  };

  const sizeInMB = 10;
  const maxSize = sizeInMB * 1024 * 1024;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).single(uploadedFilename);

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (error) => {
      if (req.fileValidationError) return res.status(422).send(req.fileValidationError);

      if (error) {
        console.error(error);
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(422).send({
            status: "Failed File Handler",
            message: `Max file sized is ${sizeInMB}MB`,
          });
        }
        return res.status(422).send(error);
      }

      return next();
    });
  };
};
