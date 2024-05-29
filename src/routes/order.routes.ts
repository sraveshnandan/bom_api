import express from "express";
import { Authorise } from "../middlewares";
import {
  CreateOrderFunction,
  GetOrderFunction,
  UpdateOrderFunction,
} from "../controllers";
const router = express.Router();
// order routes

// creating a new order
router.route("/order/create").post(Authorise, CreateOrderFunction);
// updating previous
router.route("/order/update").post(Authorise, UpdateOrderFunction);

//geting all orders
router.route("/orders").get(GetOrderFunction);

export default router;
