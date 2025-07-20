import express from "express";
import { AuthController } from "../controller/auth.controller";

const authRoutes = express();
const authController = new AuthController();

authRoutes.post(
  "/auth/register",
  authController.createUser.bind(authController)
);
authRoutes.post("/auth/login", authController.login.bind(authController));
authRoutes.post("/auth/otp", authController.sendOtp.bind(authController));
authRoutes.post(
  "/auth/verifyotp",
  authController.verifyOtp.bind(authController)
);
authRoutes.post(
  "/auth/resetpassword",
  authController.resetPassword.bind(authController)
);

export default authRoutes;
