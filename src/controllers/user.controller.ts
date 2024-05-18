import { JWT_SECRET, SMS_GAITWAY_API_KEY, SMS_GAITWAY_URL } from "../config";
import express from "express";
import { User } from "../models";
import jwt from "jsonwebtoken";
import { generateOTP, generateReferCode } from "../utils";
import { imagekit } from "../lib";
import axios from "axios";

// function to send otp
const SendOtp = async (req: any, res: any) => {
  try {
    const { mobile_no } = req.body;
    console.log("otp requested from :", req.headers);
    const user = await User.findOne({ phone_no: mobile_no });
    const otp = generateOTP();
    if (!mobile_no) {
      return res.status(500).json({
        success: false,
        message: "Mobile number must be provided.",
      });
    }

    const smsBody = {
      route: "otp",
      variables_values: otp,
      numbers: mobile_no,
    };
    const body = JSON.stringify(smsBody);
    const data = await axios.post(SMS_GAITWAY_URL!, body, {
      headers: {
        authorization: SMS_GAITWAY_API_KEY!,
        "Content-Type": "application/json",
      },
    });

    console.log("otp sending responce", data);

    if (data.data.return) {
      if (user) {
        const newOtp = {
          expiry: new Date(Date.now() + 10 * 60 * 1000),
          value: otp,
        };
        user.otp = newOtp;
        await user.save();
        return res.status(200).json({
          success: true,
          message: `OTP sent successfully to ${mobile_no} .`,
          otp,
          account_status: "registred",
        });
      }
      res.status(200).json({
        success: true,
        message: `OTP sent successfully to ${mobile_no} .`,
        otp,
        account_status: "not registred",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Unable to send otp at this time , please try again later.",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
// function to register an user
const RegisterUserFunction = async (req: any, res: any) => {
  try {
    const { full_name, email, phone, referCode } = req.body;
    let alreadyExists = await User.findOne({ email, phone_no: phone });
    if (alreadyExists) {
      return res.status(401).json({
        success: false,
        message: "Account already exists, please login.",
      });
    }
    const data = {
      full_name,
      email,
      phone_no: phone,
      avatar: {
        public_id: "",
        url: "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg",
      },
      referCode: generateReferCode(),
    };

    const refrer = await User.findOne({ referCode });

    const user = await User.create(data);

    if (refrer) {
      refrer.wallet.currentBallence += 10;
      const userId: any = user._id;
      refrer.referCount!.push(userId);
      await refrer.save();
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET!, { expiresIn: "30d" });

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user,
      token,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// function to login user
const LoginUserFunction = async (req: any, res: any) => {
  try {
    const { phone_no, otp } = req.body;
    let user = await User.findOne({ phone_no }).populate("referCount");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account found,Invalid phone number.",
      });
    }
    const isOtpExpired = user.otp?.expiry! < new Date();
    if (isOtpExpired) {
      return res.status(401).json({
        success: false,
        message: "OTP is expired, please try again.",
      });
    }
    const otpMatched = user.otp?.value.toString() === otp.toString();
    if (otpMatched) {
      user.otp = {
        expiry: new Date(Date.now()),
        value: "",
      };
      await user.save();
      const token = jwt.sign({ id: user._id }, JWT_SECRET!, {
        expiresIn: "30d",
      });
      return res.status(200).json({
        success: true,
        message: `Welcome back ${user.full_name}`,
        user,
        token,
      });
    }
    res.status(401).json({
      success: false,
      message: "Otp not matched, invalid otp.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//function to fetch user profile
const fetchUserProfileFunction = async (req: any, res: any) => {
  try {
    const profile = res.user;
    res.status(200).json({
      success: true,
      profile,
      message: "Profile fetched successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// function to update user profile
const UpdateUserProfileFunction = async (req: express.Request, res: any) => {
  try {
    const user = await User.findById(res.user._id);
    const dataToUpdate = {
      ...req.body,
      avatar: user?.avatar,
    };

    // Uploading file to ImageKit
    if (req.file) {
      console.log(
        "file found first of all removing previous one if it is available."
      );
      // if user has already avatar then deleting the old one
      if (user?.avatar.public_id !== "") {
        const fileId = user?.avatar.public_id;
        const result = await new Promise((resolve, reject) => {
          imagekit.deleteFile(fileId!, (err, result) => {
            if (err) {
              reject(err);
              console.log("Previous file deletion error.", err);
            } else {
              resolve(result);
            }
          });
        });
      }
      console.log("Uploading img....");
      const result: any = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: req.file?.buffer!,
            fileName: `${user?._id}${req.file?.originalname}`,
            tags: [
              "single-upload-user-avatar",
              `${user?.full_name}`,
              `${user?._id}`,
            ], // Optionally, add tags
          },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
      console.log("Uploading done..");
      // inserting newly uploaded avatar data to the update payload
      dataToUpdate.avatar = {
        public_id: result.fileId,
        url: result.url,
      };
      const updatedUser = await User.findByIdAndUpdate(
        { _id: res.user._id },
        { ...dataToUpdate },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        updatedProfile: updatedUser,
        message: "Profile update route fetched.",
      });
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: res.user._id },
        { ...dataToUpdate },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        updatedProfile: updatedUser,
        message: "Profile update route fetched.",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
export {
  RegisterUserFunction,
  SendOtp,
  LoginUserFunction,
  fetchUserProfileFunction,
  UpdateUserProfileFunction,
};
