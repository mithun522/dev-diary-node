import express from "express";
import { LanguageController } from "../controller/language.controller";

const languageRoutes = express();
const languageController = new LanguageController();

languageRoutes.get(
  "",
  languageController.getAllLanguages.bind(languageController)
);
languageRoutes.get(
  "/:id",
  languageController.getSingleLanguage.bind(languageController)
);
languageRoutes.post(
  "",
  languageController.createLanguage.bind(languageController)
);

export default languageRoutes;
