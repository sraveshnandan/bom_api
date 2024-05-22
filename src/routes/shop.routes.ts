import { Router } from "express";
import { Authorise, upload } from "../middlewares";
import { createShop } from "../controllers/shop.controller";

const router = Router();
router
  .route("/shop/create")
  .post(upload.single("banner"), Authorise, createShop);

export default router;
