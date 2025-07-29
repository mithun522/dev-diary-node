import { Router } from "express";
import { TechInterviewController } from "../controller/tech-interview.controller";

const techInterviewRoutes = Router();
const techInterviewController = new TechInterviewController();

techInterviewRoutes.post(
  "/techinterview",
  techInterviewController.createTechInterview.bind(techInterviewController)
);

techInterviewRoutes.get(
  "/techinterview/:id",
  techInterviewController.getTechInterviewByUserId.bind(techInterviewController)
);

techInterviewRoutes.get(
  "/techinterview",
  techInterviewController.getTechInterviewByLanguage.bind(
    techInterviewController
  )
);

techInterviewRoutes.delete(
  "/techinterview/:id",
  techInterviewController.deleteTechInterview.bind(techInterviewController)
);

techInterviewRoutes.put(
  "/techinterview/:id",
  techInterviewController.updateTechInterivew.bind(techInterviewController))

export default techInterviewRoutes;
