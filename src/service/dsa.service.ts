import { DeleteResult, Not, UpdateResult } from "typeorm";
import { Dsa } from "../entity/Dsa";
import { ConflictError } from "../error/conflict.error";
import { DsaRepository } from "../repository/dsa-repo";
import { checkUserExists } from "../utils/user-validation.utils";
import { BadRequestError } from "../error/bad-request.error";
import { NotFoundError } from "../error/not-found.error";
import { User } from "../entity/User";

export class DsaService {
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

  async getDsaByUserId(userId: User): Promise<Dsa[]> {
    try {
      const dsa = await DsaRepository.find({
        where: { createdBy: userId },
        order: {
          createdAt: "DESC",
        },
      });
      return dsa;
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
