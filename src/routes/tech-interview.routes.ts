import { Router } from "express";
import { TechInterviewController } from "../controller/tech-interview.controller";

const techInterviewRoutes = Router();
const techInterviewController = new TechInterviewController();

techInterviewRoutes.post(
  "/",
  techInterviewController.createTechInterview.bind(techInterviewController)
);

techInterviewRoutes.get(
  "/search",
  techInterviewController.searchTechInterview.bind(techInterviewController)
);

techInterviewRoutes.get(
  "/:id",
  techInterviewController.getTechInterviewByUserId.bind(techInterviewController)
);

techInterviewRoutes.get(
  "/",
  techInterviewController.getTechInterviewByLanguage.bind(
    techInterviewController
  )
);

techInterviewRoutes.delete(
  "/:id",
  techInterviewController.deleteTechInterview.bind(techInterviewController)
);

techInterviewRoutes.put(
  "/:id",
  techInterviewController.updateTechInterivew.bind(techInterviewController)
);

export default techInterviewRoutes;
