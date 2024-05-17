import express from "express";
import { imagekit } from "../lib";
import { Banner, Category } from "../models";
const createCategoryFunction = async (req: express.Request, res: any) => {
  try {
    const { name } = req.body;
    if (!req.file) {
      return res.status(401).json({
        success: false,
        message: "Category Image is required.",
      });
    }

    const newCategory = {
      name,
      creator: res.user._id,
      image: {},
    };
    console.log("Uploading img....");
    const result: any = await new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: req.file?.buffer!,
          fileName: `${res.user?._id}${req.file?.originalname}`,
          tags: [
            "single-upload-user-avatar",
            `${res.user?.full_name}`,
            `${res.user?._id}`,
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

    newCategory.image = {
      public_id: result.fileId,
      url: result.url,
    };

    const newCat = await Category.create(newCategory);
    res.status(201).json({
      success: true,
      message: `New Category created with name:${newCat.name}`,
      new_category: newCat,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const GetCategory = async (req: express.Request, res: any) => {
  try {
    const { limit } = req.headers;
    const categories = await Category.find({})
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("creator");

    res.status(200).json({
      success: true,
      message: "Category fetched successfully.",
      categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const UpdateCategoryFunction = async (req: express.Request, res: any) => {
  try {
    const { name, id } = req.body;
    const category = await Category.findById({ _id: id });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Invalid Id , No category found.",
      });
    }
    let updatePayload = {
      name,
      image: category.image,
    };

    if (req.file) {
      // deleting previous image
      const fileId = category.image.public_id;
      const deleteRequest = await new Promise((resolve, reject) => {
        imagekit.deleteFile(fileId!, (err, result) => {
          if (err) {
            reject(err);
            console.log("Previous file deletion error.", err);
          } else {
            resolve(result);
          }
        });
      });
      //uploading new one
      console.log("Uploading img....");
      const result: any = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: req.file?.buffer!,
            fileName: `${req.file?.originalname}`,
            tags: ["categoy image"], // Optionally, add tags
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
      updatePayload.image = {
        public_id: result.fileId,
        url: result.url,
      };
    }
    const catId = category._id;
    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: catId },
      { ...updatePayload },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      updatedCategory,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const DeleteCategoryFunction = async (req: express.Request, res: any) => {
  try {
    const { id } = req.query;
    const category = await Category.findById({ _id: id });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Invalid Id, No category found.",
      });
    }
    await Category.findByIdAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createBannerFunction = async (req: express.Request, res: any) => {
  try {
    const { name } = req.body;
    if (!req.file) {
      return res.status(401).json({
        success: false,
        message: "Banner Image is required.",
      });
    }

    const newCategory = {
      name,
      creator: res.user._id,
      image: {},
    };
    console.log("Uploading img....");
    const result: any = await new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: req.file?.buffer!,
          fileName: `${res.user?._id}${req.file?.originalname}`,
          tags: [
            "single-upload-user-avatar",
            `${res.user?.full_name}`,
            `${res.user?._id}`,
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

    newCategory.image = {
      public_id: result.fileId,
      url: result.url,
    };

    const newBan = await Banner.create(newCategory);
    res.status(201).json({
      success: true,
      message: `New Banner created with name:${newBan.name}`,
      new_category: newBan,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const GetBanners = async (req: express.Request, res: any) => {
  try {
    const { limit } = req.headers;
    const Banners = await Banner.find({})
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("creator");

    res.status(200).json({
      success: true,
      message: "Banners fetched successfully.",
      Banners,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const UpdateBannerFunction = async (req: express.Request, res: any) => {
  try {
    const { name, id } = req.body;
    const banner = await Banner.findById({ _id: id });
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Invalid Id , No category found.",
      });
    }
    let updatePayload = {
      name,
      image: banner.image,
    };

    if (req.file) {
      // deleting previous image
      const fileId = banner.image.public_id;
      const deleteRequest = await new Promise((resolve, reject) => {
        imagekit.deleteFile(fileId!, (err, result) => {
          if (err) {
            reject(err);
            console.log("Previous file deletion error.", err);
          } else {
            resolve(result);
          }
        });
      });
      //uploading new one
      console.log("Uploading img....");
      const result: any = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: req.file?.buffer!,
            fileName: `${req.file?.originalname}`,
            tags: ["categoy image"], // Optionally, add tags
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
      updatePayload.image = {
        public_id: result.fileId,
        url: result.url,
      };
    }
    const catId = banner._id;
    const updatedBanner = await Banner.findByIdAndUpdate(
      { _id: catId },
      { ...updatePayload },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Banner updated successfully.",
      updatedBanner,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const DeleteBannerFunction = async (req: any, res: any) => {
  try {
    const { id } = req.query;
    const banner = await Banner.findById({ _id: id });

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Invalid Id, No Banner found.",
      });
    }
    await Banner.findByIdAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      message: "Banner deleted successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createCategoryFunction,
  GetCategory,
  UpdateCategoryFunction,
  DeleteCategoryFunction,
  createBannerFunction,
  GetBanners,
  UpdateBannerFunction,
  DeleteBannerFunction,
};
