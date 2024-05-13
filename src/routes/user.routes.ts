import { Router } from "express";
import {
  LoginUserFunction,
  RegisterUserFunction,
  SendOtp,
  UpdateUserProfileFunction,
  fetchUserProfileFunction,
} from "../controllers";
import { Authorise, CheckAdmin, singleUpload } from "../middlewares";

const router = Router();

router.route("/sendOtp").post(SendOtp);
router.route("/user/register").post(RegisterUserFunction);
router.route("/user/login").post(LoginUserFunction);
router
  .route("/user/profile")
  .get(Authorise, CheckAdmin, fetchUserProfileFunction);

router
  .route("/user/update")
  .post(Authorise, singleUpload, UpdateUserProfileFunction);

export default router;
