import { TechInterview } from "../entity/TechInterview";
import { Language } from "../enum/programming-language.enum";
import { ConflictError } from "../error/conflict.error";
import { TechInterviewRepo } from "../repository/tech-interview.repo";
import { checkUserExists } from "../utils/user-validation.utils";

export class TechInterviewService {
  async createTechInterview(userId: number, techInterviewData: TechInterview) {
    console.log(techInterviewData);
    try {
      const user = await checkUserExists("id", userId);

      const existingTechInterview = await TechInterviewRepo.findOneBy({
        user: user,
        question: techInterviewData.question,
      });

      if (existingTechInterview) {
        throw new ConflictError("This question already exists");
      }

      const techInterview = { ...new TechInterview(), ...techInterviewData };

      techInterview.user = user;
      techInterview.createdAt = new Date();
      techInterview.updatedAt = new Date();

      return TechInterviewRepo.save(techInterview);
    } catch (error) {
      throw error;
    }
  }

  async getTechInterviewByUserId(userId: number) {
    try {
      const techInterview = await TechInterviewRepo.find({
        where: { user: { id: userId } },
      });
      return techInterview;
    } catch (error) {
      throw error;
    }
  }

  async getTechInterviewByLanguage(userId: number, language: Language) {
    try {
      const techInterview = await TechInterviewRepo.find({
        where: {
          user: { id: userId },
          language: language,
        },
      });
      return techInterview;
    } catch (error) {
      throw error;
    }
  }

  async updateTechInterview(
    userId: number,
    techInterviewId: number,
    techInterviewData: TechInterview
  ) {
    try {
      const techInterview = await TechInterviewRepo.findOneBy({
        id: techInterviewId,
        user: { id: userId },
      });
      if (!techInterview) {
        throw new Error("Tech Interview not found");
      }

      if (techInterviewData.question) {
        const existingTechInterview = await TechInterviewRepo.findOneBy({
          user: { id: userId },
          question: techInterviewData.question,
        });
        if (existingTechInterview) {
          throw new ConflictError("This question already exists");
        }
      }

      const updatedTechInterview = { ...techInterview, ...techInterviewData };
      updatedTechInterview.updatedAt = new Date();
      return TechInterviewRepo.save(updatedTechInterview);
    } catch (error) {
      throw error;
    }
  }

  async deleteTechInterview(
    userId: number,
    techInterviewId: number
  ): Promise<string> {
    try {
      const techInterview = await TechInterviewRepo.findOneBy({
        id: techInterviewId,
        user: { id: userId },
      });
      if (!techInterview) {
        throw new Error("Tech Interview not found");
      }
      await TechInterviewRepo.delete(techInterview);
      return "Tech Interview deleted successfully";
    } catch (error) {
      throw error;
    }
  }
}
