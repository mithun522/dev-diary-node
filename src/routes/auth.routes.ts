import express from "express";
import { AuthController } from "../controller/auth.controller";

const authRoutes = express();
const authController = new AuthController();

authRoutes.post("/register", authController.createUser.bind(authController));
authRoutes.post("/login", authController.login.bind(authController));
authRoutes.post("/otp", authController.sendOtp.bind(authController));
authRoutes.post("/verifyotp", authController.verifyOtp.bind(authController));
authRoutes.post(
  "/resetpassword",
  authController.resetPassword.bind(authController)
);

export default authRoutes;
