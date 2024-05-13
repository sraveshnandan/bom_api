import mongoose from "mongoose";
import { db_url_local } from "./secret";

const ConnectDb: (next: () => void) => void = (next) => {
  mongoose
    .connect(db_url_local!,{dbName:"bmarket"})
    .then((con) => {
      console.log(`🪣  Database connected to : ${con.connection.host}`);
      return next();
    })
    .catch((e) => console.log(e));
};

export { ConnectDb };
