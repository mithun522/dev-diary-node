import { Router } from "express";
import { UserController } from "../controller/User.controller";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get("/users", userController.getAllUser.bind(userController));
userRoutes.post("/user", userController.createUser.bind(userController));
userRoutes.get("/user/:id", userController.getSingleUser.bind(userController));
userRoutes.put("/user/:id", userController.updateUser.bind(userController));

export { userRoutes };
