// Importing all modules
import express from "express";
import cors from "cors";
import { ConnectDb, Mode, Port } from "./config";
// importing api routes
import UserRoutes from "./routes/user.routes";
import paymentRoutes from "./routes/payment.routes";
import adminRoutes from "./routes/admin.routes";
import productRoutes from "./routes/product.routes";
import shopRoute from "./routes/shop.routes";
import orderRoutes from "./routes/order.routes";
// creating express server instance
const app = express();
// Using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:8081", "http://127.0.0.1:8081", "0.0.0.0/0"],
    credentials: true,
  })
);
// using endpoints
app.use(
  "/api/v1",
  UserRoutes,
  paymentRoutes,
  adminRoutes,
  productRoutes,
  shopRoute,
  orderRoutes
);
const startServer = () => {
  app.listen(Port, () => {
    console.log(`🌍 Server is running at port : ${Port} in ${Mode} mode.`);
  });
};
// connecting to database and starting the server
ConnectDb(() => {
  startServer();
});
