// Importing dotenv to load all env variables
import dotenv from "dotenv";
dotenv.config();

const Port = process.env.PORT;
const Mode = process.env.NODE_ENV;
const db_url_local = process.env.MONGO_URI_LOCAl;
const JWT_SECRET = process.env.JWT_PRIVATE_KEY;

// exporting env variables
export { Port, Mode, db_url_local, JWT_SECRET };
