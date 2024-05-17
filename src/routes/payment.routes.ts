import { Router } from "express";
import { Authorise } from "../middlewares";
import { BuySubscriptionFunction, VerifyPaymentFunction } from "../controllers/payment.controllers";

const router = Router();
// for creating new order  
router.route("/pay").post(Authorise, BuySubscriptionFunction);
// for verifying payment 
router.route("/payment-verify").post(Authorise,VerifyPaymentFunction)

export default router;
