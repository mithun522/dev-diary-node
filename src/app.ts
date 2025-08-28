import express from "express";
import { userRoutes } from "./routes/User.routes";
import cors from "cors";
import bodyParser = require("body-parser");
import { errorHandler } from "./middleware/error-handler.middleware";
import authRoutes from "./routes/auth.routes";
import { checkAuth } from "./middleware/auth.middleware";
import techInterviewRoutes from "./routes/tech-interview.routes";
import dsaRoutes from "./routes/dsa-routes";
import blogsRoutes from "./routes/blogs.routes";
import path = require("path");

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const apiPrefix = "/api/v1";

app.use(`${apiPrefix}/auth`, authRoutes); // 🔓 No auth
app.use(`${apiPrefix}`, checkAuth, userRoutes); // 🔐 Needs auth
app.use(`${apiPrefix}/techinterview`, checkAuth, techInterviewRoutes); // 🔐 Needs auth
app.use(`${apiPrefix}/dsa`, checkAuth, dsaRoutes); // 🔐 Needs auth
app.use(`${apiPrefix}/blogs`, checkAuth, blogsRoutes);

app.use(errorHandler);

export default app;
