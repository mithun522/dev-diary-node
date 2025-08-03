import { ILike } from "typeorm";
import { AppDataSource } from "../data-source";
import { TechInterview } from "../entity/TechInterview";
import { Language } from "../enum/programming-language.enum";
import { BadRequestError } from "../error/bad-request.error";
import { ConflictError } from "../error/conflict.error";
import { NotFoundError } from "../error/not-found.error";
import { TechInterviewRepo } from "../repository/tech-interview.repo";
import { checkUserExists } from "../utils/user-validation.utils";

export class TechInterviewService {
  async createTechInterview(userId: number, techInterviewData: TechInterview) {
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
    if (!userId || !techInterviewId) {
      throw new BadRequestError("Missing required parameters.");
    }
    console.log("Comes in");

    try {
      const techInterview = await AppDataSource.getRepository(TechInterview)
        .createQueryBuilder("techInterview")
        .leftJoinAndSelect("techInterview.user", "user")
        .where("techInterview.id = :id", { id: techInterviewId })
        .andWhere("user.id = :userId", { userId })
        .getOne();
      if (!techInterview) {
        throw new NotFoundError("Tech Interview not found");
      }

      if (techInterviewData.question) {
        const existingTechInterview = await AppDataSource.getRepository(
          TechInterview
        )
          .createQueryBuilder("techInterview")
          .leftJoinAndSelect("techInterview.user", "user")
          .where("techInterview.question = :question", {
            question: techInterviewData.question,
          })
          .andWhere("user.id = :userId", { userId })
          .andWhere("techInterview.id != :id", { id: techInterviewId })
          .getOne();
        if (existingTechInterview) {
          throw new ConflictError("This question already exists");
        }
      }

      const updatedTechInterview = { ...techInterview, ...techInterviewData };
      updatedTechInterview.updatedAt = new Date();
      const { id, user, ...result } = updatedTechInterview;
      return TechInterviewRepo.update(id, result);
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

  async searchTechInterview(
    userId: number,
    search: string,
    language: Language
  ): Promise<TechInterview[]> {
    try {
      if (!userId || !language) {
        throw new BadRequestError("Missing required query parameters.");
      }

      const techInterview = await TechInterviewRepo.find({
        where: [
          {
            user: { id: userId },
            language: language,
            question: ILike(`%${search}%`),
          },
          {
            user: { id: userId },
            language: language,
            answer: ILike(`%${search}%`),
          },
        ],
      });
      return techInterview;
    } catch (error) {
      throw error;
    }
  }
}
