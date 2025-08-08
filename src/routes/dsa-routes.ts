import express from "express";
import { DsaController } from "../controller/dsa.controller";

const dsaRoutes = express();
const dsaController = new DsaController();

dsaRoutes.get("", dsaController.getAllDsa.bind(dsaController));
dsaRoutes.get("/user", dsaController.getDsaByUserId.bind(dsaController));
dsaRoutes.get("/:id", dsaController.getSingleDsa.bind(dsaController));
dsaRoutes.post("", dsaController.createDsa.bind(dsaController));
dsaRoutes.put("/:id", dsaController.updateDsa.bind(dsaController));
dsaRoutes.delete("/:id", dsaController.deleteDsa.bind(dsaController));

export default dsaRoutes;
