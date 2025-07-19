import express from "express";
import { AuthController } from "../controller/auth.controller";

const authRoutes = express();
const authController = new AuthController();

authRoutes.post("/auth/login", authController.login.bind(authController));

export default authRoutes;
