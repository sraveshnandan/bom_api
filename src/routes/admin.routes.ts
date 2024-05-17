import { Router } from "express";
import { Authorise, CheckAdmin, upload } from "../middlewares";
import {
  DeleteBannerFunction,
  DeleteCategoryFunction,
  GetBanners,
  GetCategory,
  UpdateBannerFunction,
  UpdateCategoryFunction,
  createBannerFunction,
  createCategoryFunction,
} from "../controllers";

const router = Router();
// for curd operations on Category
router
  .route("/category")
  .get(GetCategory)
  .post(upload.single("image"), Authorise, CheckAdmin, createCategoryFunction)
  .put(upload.single("image"), Authorise, CheckAdmin, UpdateCategoryFunction)
  .delete(Authorise, CheckAdmin, DeleteCategoryFunction);

// for curd operation on banners
router
  .route("/banner")
  .get(GetBanners)
  .post(upload.single("image"), Authorise, CheckAdmin, createBannerFunction)
  .put(upload.single("image"), Authorise, CheckAdmin, UpdateBannerFunction)
  .delete(Authorise, CheckAdmin, DeleteBannerFunction);

export default router;
