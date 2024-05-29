import { Router } from "express";
import { Authorise, upload } from "../middlewares";
import {
  GetAllShop,
  UpdateShop,
  createShop,
} from "../controllers/shop.controller";

const router = Router();
router
  .route("/shop/create")
  .post(upload.single("banner"), Authorise, createShop);
router
  .route("/shop/update")
  .put(upload.single("banner"), Authorise, UpdateShop);
router.route("/shops").get(GetAllShop);

export default router;
