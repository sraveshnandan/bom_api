import express from "express";
import { uploadToImageKit } from "../utils";
import { Product } from "../models";
// creating a  new Product
const createProductFunction = async (req: express.Request, res: any) => {
  try {
    if (req.files?.length === 0 || !req.files) {
      return res.status(409).json({
        success: false,
        message: "You can not create a product without images.",
      });
    }
    let newProductPayload = {
      ...req.body,
      banners: [],
    };
    // uploading product banners to imagekit
    const images = req.files as Express.Multer.File[];
    const uploadPromise = images.map((img) => uploadToImageKit(img));
    let uploadResult = await Promise.all(uploadPromise);
    newProductPayload.banners = uploadResult;

    const newProduct = await Product.create(newProductPayload);

    res.status(201).json({
      success: true,
      newProduct,
      message: "Product created successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// geting all Products
const GetProductFunction = async (req: express.Request, res: any) => {
  try {
    const { limit } = req.query;
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("owner categories");

    res.status(200).json({
      success: true,
      message: "Product fetched successfully.",
      products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server Error.",
    });
  }
};

// updating a product
const UpdateProductFunction = async (req: express.Request, res: any) => {
  try {
    const { id } = req.query;
    const updatedData = req.body;
    const images = req.files as Express.Multer.File[];
    let product: any = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Invalid Id , No product found.",
      });
    }

    // Update images if any new files are uploaded
    if (images && images.length > 0) {
      const files = req.files as Express.Multer.File[];
      const uploadPromises = files.map((file) => uploadToImageKit(file));
      const uploadResults = await Promise.all(uploadPromises);

      // Assuming the images are for banners, adjust as needed for your use case
      product.banners = uploadResults as any;
    }

    // Update other fields
    Object.keys(updatedData).forEach((key: any) => {
      product[key] = updatedData[key] as any;
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

// Deleting a product Products
const DeleteProductFunction = async (req: express.Request, res: any) => {
  try {
    const { id } = req.query;
    const product: any = await Product.findById(id).populate("owner");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Invalid Id, No product found.",
      });
    }
    if (product?.owner?.owner?.toString() === res.user._id.toString()) {
      await Product.deleteOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "Product Deleted successfully.",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "You are not allowed to delete this product.",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server Error.",
    });
  }
};

export {
  createProductFunction,
  GetProductFunction,
  UpdateProductFunction,
  DeleteProductFunction,
};
