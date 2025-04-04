import express from "express";
import { pool } from "../app.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import { sendEmail } from "../smtp/smtp.js";
import { SendGRID } from "../sendgrid/sendGrind.js";
import { uploadFileToDrive, deleteFileFromDrive } from "../../Drive/config.js";

const router = express.Router();
router.use(cookieParser());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default router;