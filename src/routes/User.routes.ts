import { Router } from "express";
import { UserController } from "../controller/User.controller";
import { checkRole } from "../middleware/check-role.middleware";
import { Roles } from "../enum/roles.enum";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get(
  "/users",
  checkRole(Roles.ADMIN),
  userController.getAllUser.bind(userController)
);
userRoutes.get("/user/:id", userController.getSingleUser.bind(userController));
userRoutes.put("/user/:id", userController.updateUser.bind(userController));
userRoutes.delete(
  "/user/:id",
  checkRole(Roles.ADMIN),
  userController.deleteUser.bind(userController)
);

export { userRoutes };
