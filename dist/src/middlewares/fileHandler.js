"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.uploadFiles = void 0;
const multer_1 = __importDefault(require("multer"));
const uploadFiles = (uploadedFilename, location) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, location);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
        },
    });
    const fileFilter = (req, file, cb) => {
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
    const upload = (0, multer_1.default)({
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
    return (req, res, next) => {
        upload(req, res, (error) => {
            if (req.fileValidationError)
                return res.status(422).send(req.fileValidationError);
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
exports.uploadFiles = uploadFiles;
const uploadFile = (uploadedFilename, location) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, location);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
        },
    });
    const fileFilter = (req, file, cb) => {
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
    const upload = (0, multer_1.default)({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSize,
        },
    }).single(uploadedFilename);
    return (req, res, next) => {
        upload(req, res, (error) => {
            if (req.fileValidationError)
                return res.status(422).send(req.fileValidationError);
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
exports.uploadFile = uploadFile;
