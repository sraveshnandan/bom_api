import { Router } from "express";
import { Authorise, upload } from "../middlewares";
import {
  DeleteProductFunction,
  GetProductFunction,
  UpdateProductFunction,
  createProductFunction,
} from "../controllers";

const router = Router();

router
  .route("/product/create")
  .post(upload.array("banner", 4), Authorise, createProductFunction);
router.route("/products").get(GetProductFunction);
router.route("/products").delete(Authorise, DeleteProductFunction);
router
  .route("/products/update")
  .post(upload.array("banner", 4), Authorise, UpdateProductFunction);

export default router;
