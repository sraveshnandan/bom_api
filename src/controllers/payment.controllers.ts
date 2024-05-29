import express from "express";
import { razorpay } from "../lib";
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
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
    const userId = res.user._id;

    const user = await User.findById(userId);
    const amount: any = (await razorpay.orders.fetch(razorpay_order_id)).amount;
    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

    if (paymentDetails.captured) {
      const today = new Date();
      let expiry = new Date();
      if (amount === 100) {
        expiry.setDate(today.getDate() + 7);
      }
      if (amount === 14900) {
        expiry.setMonth(today.getMonth() + 1);
      }
      if (amount === 99900) {
        expiry.setFullYear(today.getFullYear() + 1);
      }
      const transaction = await Tansaction.create({
        payment_id: razorpay_payment_id,
        amount: Number(amount) / 100,
        payer: user?._id,
        other: {
          razorpay_signature,
          paymentDetails,
          expiry,
        },
      });
      user?.wallet.transations?.push(transaction._id as any);
      await user?.save();
      return res.status(200).json({
        success: true,
        message: "Payment successfull.",
      });
    } else {
      return res.status(409).json({
        success: false,
        message: "Payment is not confermed by the server.",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const CheckSubcription = async (req: express.Request, res: any) => {
  try {
    const userId = res.user._id;
    const transaction: any = await Tansaction.findOne({ payer: userId });
    if (!transaction) {
      return res.status(409).json({
        success: false,
        message: "No any subscription found",
      });
    }
    const isExpired = transaction?.other?.expiry < new Date();
    if (isExpired) {
      return res.status(400).json({
        success: false,
        message: "Your subscription is expired.",
      });
    }
    const daysRemaining =
      transaction.other.expiry.getDate() - new Date().getDate();
    const status = `${daysRemaining} days left `;
    res.status(200).json({
      success: true,
      transaction,
      status,
      message: "Successfully fetched Subscription Details.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { BuySubscriptionFunction, VerifyPaymentFunction, CheckSubcription };
