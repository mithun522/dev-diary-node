import express from "express";
import { BlogsController } from "../controller/blogs.controller";
import { upload } from "../config/multer";

const blogsRoutes = express();
const blogsController = new BlogsController();

blogsRoutes.get("", blogsController.getAllBlogs.bind(blogsController));
blogsRoutes.get(
  "/published",
  blogsController.getPublishedBlogs.bind(blogsController)
);
blogsRoutes.get(
  "/draft",
  blogsController.getPublishedBlogs.bind(blogsController)
);
blogsRoutes.get(
  "/user",
  blogsController.getBlogsByUserId.bind(blogsController)
);
blogsRoutes.get("/:id", blogsController.getSingleBlog.bind(blogsController));
blogsRoutes.post(
  "",
  upload.single("image"), // 👈 name must match formData key
  blogsController.createBlogs.bind(blogsController)
);
// blogsRoutes.put("/:id", blogsController.updateBlog.bind(blogsController));
// blogsRoutes.delete("/:id", blogsController.deleteBlog.bind(blogsController));

export default blogsRoutes;
