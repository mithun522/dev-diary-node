import express from "express";
import { userRoutes } from "./routes/User.routes";
import cors from "cors";
import bodyParser = require("body-parser");
import { errorHandler } from "./middleware/error-handler.middleware";
import authRoutes from "./routes/auth.routes";
import { checkAuth } from "./middleware/auth.middleware";
import techInterviewRoutes from "./routes/tech-interview.routes";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/v1", authRoutes, checkAuth, userRoutes, techInterviewRoutes);

app.use(errorHandler);

export default app;
