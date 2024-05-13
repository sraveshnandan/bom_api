import { NextFunction } from "express";
import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { IDecodedToken } from "../types";
import { User } from "../models";

//middleware to check if user is logged in or not
const Authorise = async (
  req: express.Request,
  res: any,
  next: NextFunction
) => {
  try {
    const token = req.headers?.token!;
    // if request does not contain auth token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Protected route, auth token is required.",
      });
    }
    // decoding jwt token
    const decode: IDecodedToken | any = jwt.verify(
      token as string,
      JWT_SECRET!
    );
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const isTokenExpired = decode?.exp < currentTimestamp;
    // if no decoded data found
    if (!decode || isTokenExpired) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired auth token, please login again.",
      });
    }
    const user = await User.findById(decode.id).populate("referCount");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is compramised, or invalid token provided.",
      });
    }
    res.user = user;
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server error.",
    });
  }
};

// middleware to check if user  is admin

const CheckAdmin = async (
  req: express.Request,
  res: any,
  next: NextFunction
) => {
  try {
    const isUserIsAdmin = res.user.isAdmin;
    if (!isUserIsAdmin) {
      return res.status(401).json({
        status: false,
        message: "You are not allowed to perform this action.",
      });
    }
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server error.",
    });
  }
};

// middleware to check if user  is admin
const CheckShopOwner = async (
  req: express.Request,
  res: any,
  next: NextFunction
) => {
  try {
    const isUserIsShopOwner = res.user.isShopOwner;
    if (!isUserIsShopOwner) {
      return res.status(401).json({
        status: false,
        message: "You are not allowed to perform this action.",
      });
    }
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server error.",
    });
  }
};

// exporting function

export { Authorise, CheckAdmin, CheckShopOwner };
