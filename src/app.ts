import express from "express";
import { userRoutes } from "./routes/User.routes";
import cors from "cors";
import bodyParser = require("body-parser");
import { errorHandler } from "./middleware/error-handler.middleware";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use("/api", userRoutes);

app.use(errorHandler);

export default app;
