import express from "express";
import { imagekit } from "../lib";
import { Shop, User } from "../models";
import { Tansaction } from "../models";
const createShop = async (req: express.Request, res: any) => {
  try {
    console.log("shop create endpoint");
    const { name, description, address, category } = req.body;
    let user = await User.findById(res.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found",
      });
    }
    if (user.isShopOwner) {
      let shop = await Shop.findOne({ owner: user._id }).populate("owner");
      return res.status(200).json({
        success: true,
        message: "You have already created a shop.",
        shop,
      });
    }
    user.isShopOwner = true;
    await user.save();
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
      category,
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

const UpdateShop = async (req: express.Request, res: any) => {
  try {
    const { id } = req.query;
    const shop = await Shop.findById(id).populate("owner");
    if (!shop.owner._id.toString() === res.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorised to perform this action.",
      });
    }
    const shopUpdatePayload = {
      ...req.body,
      banners: shop.banners,
    };

    // if user wants to update shop banner
    if (req.file) {
      console.log("Uploading img....");
      const result: any = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: req.file?.buffer!,
            fileName: `${shop?._id}${req.file?.originalname}`,
            tags: ["single-upload-user-avatar", `${shop.name}`, `${shop?._id}`], // Optionally, add tags
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
      shopUpdatePayload.banners = [
        {
          public_id: result.fileId,
          url: result.url,
        },
      ];
    }
    const updatedShop = await Shop.findByIdAndUpdate(
      { _id: id },
      { ...shopUpdatePayload },
      { new: true }
    ).populate("owner");

    res.status(200).json({
      success: true,
      updatedShop,
      message: "Shop updated successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetAllShop = async (req: express.Request, res: any) => {
  try {
    const { limit } = req.query;
    const shops = await Shop.find({})
      .populate("owner products category")
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    if (shops.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No shops yet.",
      });
    }
    res.status(200).json({
      success: true,
      shops,
      message: "All shops fetched successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { createShop, UpdateShop, GetAllShop };
