import express from "express";
import { imagekit } from "../lib";
import { Shop } from "../models";
import { Tansaction } from "../models";
const createShop = async (req: express.Request, res: any) => {
  try {
    const { name, description, address } = req.body;
    const tnx: any = await Tansaction.findOne({ payer: res.user._id });
    if (!tnx) {
      return res.status(404).json({
        success: false,
        message:
          "You have'nt purchased any subscription, you can't create a shop.",
      });
    }
    const shopPayload = {
      name,
      description,
      address,
      banners: [],
      owner: res.user._id,
      subscription: {
        currentPlan: tnx?.amount,
        expiryDate: tnx?.other?.expiry,
        transactions: tnx,
      },
    };
    // uploading shop image
    if (req.file) {
      console.log("Uploading img....");
      const result: any = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: req.file?.buffer!,
            fileName: `${name}${req.file?.originalname}`,
            tags: ["shop banner"], // Optionally, add tags
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
      shopPayload.banners.push({
        public_id: result.fileId,
        url: result.url,
      } as never);
    }

    const shop = await Shop.create(shopPayload);
    res.status(201).json({
      success: true,
      shop,
      message: "Shop created successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createShop };
