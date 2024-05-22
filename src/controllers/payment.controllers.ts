import express from "express";
import { razorpay } from "../lib";
import { RAZORPAY_PAYMENY_VERIFY_SIGNATURE } from "../config";
import { Tansaction, User } from "../models";
const BuySubscriptionFunction = async (req: express.Request, res: any) => {
  try {
    const { amount, userId } = req.body;
    const payment_capture = 1;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: userId,
      payment_capture,
    };

    try {
      const response = await razorpay.orders.create(options);
      console.log(response);
      res.json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
        response,
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const VerifyPaymentFunction = async (req: express.Request, res: any) => {
  try {
    // do a validation
    console.log("verify api hitted");
    const secret = RAZORPAY_PAYMENY_VERIFY_SIGNATURE;
    console.log("Requested body", req.body);
    console.log("Request headers", req.headers);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export { BuySubscriptionFunction, VerifyPaymentFunction };
