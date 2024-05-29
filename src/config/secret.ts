// Importing dotenv to load all env variables
import dotenv from "dotenv";
import { env } from "process";
dotenv.config();

const Port = process.env.PORT;
const Mode = process.env.NODE_ENV;
const db_url_local = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_PRIVATE_KEY;
const SMS_GAITWAY_URL = process.env.SMS_GAITWAY_URL;
const SMS_GAITWAY_API_KEY = process.env.SMS_GAITWAY_API_KEY;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RAZORPAY_PAYMENY_VERIFY_SIGNATURE =
  process.env.RAZORPAY_PAYMENY_VERIFY_SIGNATURE;

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
// exporting env variables
export {
  Port,
  Mode,
  db_url_local,
  JWT_SECRET,
  SMS_GAITWAY_URL,
  SMS_GAITWAY_API_KEY,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  RAZORPAY_PAYMENY_VERIFY_SIGNATURE,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};
