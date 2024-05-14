// Importing dotenv to load all env variables
import dotenv from "dotenv";
dotenv.config();

const Port = process.env.PORT;
const Mode = process.env.NODE_ENV;
const db_url_local = process.env.MONGO_URI_LOCAl;
const JWT_SECRET = process.env.JWT_PRIVATE_KEY;
const SMS_GAITWAY_URL = process.env.SMS_GAITWAY_URL;

const SMS_GAITWAY_API_KEY = process.env.SMS_GAITWAY_API_KEY;

// exporting env variables
export {
  Port,
  Mode,
  db_url_local,
  JWT_SECRET,
  SMS_GAITWAY_URL,
  SMS_GAITWAY_API_KEY,
};
