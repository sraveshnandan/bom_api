// Importing all modules
import express from "express";
import cors from "cors";
import { ConnectDb, Mode, Port } from "./config";
import UserRoutes from "./routes/user.routes";

const app = express();

// Using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:8081", "0.0.0.0/0"],
    credentials: true,
  })
);

// using endpoints

app.use("/api/v1", UserRoutes);

const startServer = () => {
  app.listen(Port, () => {
    console.log(`🌍 Server is running at port : ${Port} in ${Mode} mode.`);
  });
};

// connecting to database and starting the server
ConnectDb(() => {
  startServer();
});
