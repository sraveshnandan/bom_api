import express from "express";
import { Order } from "../models";
// for creating new order
const CreateOrderFunction = async (req: express.Request, res: any) => {
  try {
    const newOrderData = { ...req.body, user: res.user._id };

    const newOrder = await Order.create(newOrderData);

    res.status(201).json({
      success: true,
      newOrder,
      message: "Order placed successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "internal server error.",
    });
  }
};

// for updating previous order status
const UpdateOrderFunction = async (req: express.Request, res: any) => {
  try {
    const { id, shop, status } = req.query;
    let order = await Order.findById(id);
    if (!order) {
      return res.status(200).json({
        success: false,
        message: "Invalid id, No orders found.",
      });
    }

    if (shop?.toString() === order.shop.toString()) {
      order.status = String(status);
      await order.save();
      res.status(200).json({
        success: true,
        message: "Order status updated successfully.",
        order,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "You are not authorised to update status.",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "internal server error.",
    });
  }
};

// for getting all orders

const GetOrderFunction = async (req: express.Request, res: any) => {
  try {
    const { limit } = req.query;
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("products.product");

    res.status(200).json({
      success: true,
      orders,
      message: "Orders fetched successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "internal server error.",
    });
  }
};

export { CreateOrderFunction, GetOrderFunction, UpdateOrderFunction };
