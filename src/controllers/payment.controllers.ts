import express from "express";
import { razorpay } from "../lib";
import { RAZORPAY_PAYMENY_VERIFY_SIGNATURE } from "../config";
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
    const secret = RAZORPAY_PAYMENY_VERIFY_SIGNATURE;
    console.log("Requested body", req.body);
    const crypto = require("crypto");
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    console.log(
      "digest",
      digest,
      "header data",
      req.headers["x-razorpay-signature"]
    );
    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
      // process it
      return res.status(200).json({
        success: true,
        message: "Payment confirmed by server.",
      });
    } else {
      // pass it
      return res.status(400).json({
        success: false,
        message: "Payment not  confirmed by server yet.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export { BuySubscriptionFunction, VerifyPaymentFunction };
