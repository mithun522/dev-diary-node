import { DeleteResult, Not, UpdateResult } from "typeorm";
import { Dsa } from "../entity/Dsa";
import { ConflictError } from "../error/conflict.error";
import { DsaRepository } from "../repository/dsa-repo";
import { checkUserExists } from "../utils/user-validation.utils";
import { BadRequestError } from "../error/bad-request.error";
import { NotFoundError } from "../error/not-found.error";
import { User } from "../entity/User/User";
import { DifficultyLevels } from "../enum/difficulty-levels.enum";

interface DsaProgressData {
  problemsByDifficulty: {
    [key: string]: number;
  };
  problemsByTopic: {
    [key: string]: number;
  };
  problemsByLanguage: {
    [key: string]: number;
  };
}

export class DsaService {
  private pageSize = 20;

  async createDsa(user: number, dsa: Dsa): Promise<Dsa> {
    try {
      const existingUser = await checkUserExists("id", user);

      const existingDsa = await DsaRepository.findOneBy({
        link: dsa.link,
        createdBy: dsa.createdBy,
      });

      if (existingDsa) {
        throw new ConflictError("DSA already exists");
      }
      if (!Array.isArray(dsa.topics)) {
        dsa.topics = [dsa.topics].filter(Boolean);
      }

      dsa.createdBy = existingUser;
      dsa.updatedAt = new Date();

      const dsaData = await DsaRepository.save(dsa);
      return dsaData;
    } catch (err) {
      throw err;
    }
  }

  async getAllDsa(): Promise<Dsa[]> {
    try {
      const dsa = await DsaRepository.find();
      return dsa;
    } catch (err) {
      throw err;
    }
  }

  async getSingleDsa(id: number): Promise<Dsa> {
    try {
      const dsa = await DsaRepository.findOneBy({ id });
      return dsa;
    } catch (err) {
      throw err;
    }
  }

  async getDsaByUserId(
    userId: User,
    search: string,
    difficulty: DifficultyLevels = DifficultyLevels.NONE,
    pageNumber: number = 1
  ): Promise<any> {
    try {
      let query = DsaRepository.createQueryBuilder("dsa")
        .where("dsa.createdBy = :userId", { userId: userId.id })
        .orderBy("dsa.createdAt", "DESC")
        .skip((pageNumber - 1) * this.pageSize)
        .take(this.pageSize);

      if (search && search.trim() !== "") {
        query = query.andWhere("LOWER(dsa.problem) LIKE LOWER(:search)", {
          search: `%${search}%`,
        });
      }

      if (difficulty !== DifficultyLevels.NONE) {
        query = query.andWhere("dsa.difficulty = :difficulty", { difficulty });
      }

      const [dsa, totalLength] = await query.getManyAndCount();

      return { dsa: dsa, totalLength: totalLength };
    } catch (err) {
      throw err;
    }
  }

  async getDsaProgressByUser(userId: number): Promise<DsaProgressData[]> {
    try {
      await checkUserExists("id", userId);

      // Get difficulty counts directly from DB
      const [difficultyCounts] = await DsaRepository.query(`
          SELECT 
            SUM(CASE WHEN difficulty = 'EASY' THEN 1 ELSE 0 END) AS easy,
            SUM(CASE WHEN difficulty = 'MEDIUM' THEN 1 ELSE 0 END) AS medium,
            SUM(CASE WHEN difficulty = 'HARD' THEN 1 ELSE 0 END) AS hard
          FROM dsa
          WHERE created_by = ${userId};
        `);

      // Get topic counts directly from DB
      const topicRows = await DsaRepository.query(`
          SELECT topics FROM dsa WHERE created_by = ${userId};
        `);

      const topicCounts = topicRows.reduce(
        (acc: Record<string, number>, row: any) => {
          let topics: string[];
          try {
            topics = JSON.parse(row.topics);
          } catch {
            topics = [];
          }
          topics.forEach((topic) => {
            acc[topic] = (acc[topic] || 0) + 1;
          });
          return acc;
        },
        {}
      );

      const dsaProgress: DsaProgressData[] = [
        {
          problemsByDifficulty: {
            easy: Number(difficultyCounts.easy) || 0,
            medium: Number(difficultyCounts.medium) || 0,
            hard: Number(difficultyCounts.hard) || 0,
          },
          problemsByTopic: topicCounts,
          problemsByLanguage: {}, // Add language aggregation here if needed
        },
      ];

      return dsaProgress;
    } catch (err) {
      throw err;
    }
  }

  async updateDsa(id: number, dsa: Dsa): Promise<UpdateResult> {
    try {
      await checkUserExists("id", dsa.createdBy);

      const existingDsa = await DsaRepository.findOneBy({ id });
      if (!existingDsa) {
        throw new Error("DSA not found");
      }

      const existingDsaByLink = await DsaRepository.findOne({
        where: {
          link: dsa.link,
          createdBy: dsa.createdBy,
          id: Not(id),
        },
      });
      if (existingDsaByLink) {
        throw new ConflictError("DSA already exists");
      }

      dsa.updatedAt = new Date();

      const dsaData = await DsaRepository.update(id, dsa);

      return dsaData;
    } catch (err) {
      throw err;
    }
  }

  async deleteDsa(id: number): Promise<DeleteResult> {
    try {
      if (!id) {
        throw new BadRequestError("id is required");
      }

      const existingDsa = await DsaRepository.findOneBy({ id });
      if (!existingDsa) {
        throw new NotFoundError("DSA not found");
      }

      await checkUserExists("id", existingDsa.createdBy);
      const dsa = await DsaRepository.delete(id);
      return dsa;
    } catch (err) {
      throw err;
    }
  }
}
