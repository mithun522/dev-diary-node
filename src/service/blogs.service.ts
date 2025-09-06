import { plainToInstance } from "class-transformer";
import { Blogs } from "../entity/Blog";
import { BlogRepository } from "../repository/blog.repo";
import { UserRepository } from "../repository/User.repo";
import {
  checkForAllRequiredFields,
  checkUserExists,
  validateEntity,
} from "../utils/user-validation.utils";
import { BlogServiceIntervface } from "./service-interface/blog.service-interface";
import { BadRequestError } from "../error/bad-request.error";
import { ILike } from "typeorm";

export class BlogsService implements BlogServiceIntervface {
  private pageSize = 10;

  constructor() {}

  async createBlogs(blogData: Partial<Blogs>, userId: number): Promise<Blogs> {
    try {
      const existingUser = await checkUserExists("id", userId);

      const newBlog = plainToInstance(Blogs, {
        ...blogData,
        author: existingUser,
        tags: blogData.tags
          ? Array.isArray(blogData.tags)
            ? blogData.tags.join(",")
            : blogData.tags
          : "",
      });

      await validateEntity(newBlog, "Blogs");

      return await BlogRepository.save(newBlog);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllBlogs(userId: number, pageNumber: number = 1): Promise<any> {
    try {
      const queryBuilder = BlogRepository.createQueryBuilder("blog")
        .where("blog.published = :published", { published: true })
        .orWhere("blog.author = :userId", { userId })
        .orderBy("blog.createdAt", "DESC")
        .skip((pageNumber - 1) * this.pageSize)
        .take(this.pageSize);

      const [allBlogs, totalLength] = await queryBuilder.getManyAndCount();

      return { blogs: allBlogs, totalLength };
    } catch (error) {
      throw error;
    }
  }

  async getDraftBlogs(userId: number, pageNumber: number = 1): Promise<any> {
    try {
      const existingUser = await checkUserExists("id", userId);

      const totalBlogsLength = await BlogRepository.count({
        where: { isDraft: true },
      });

      const getDraftBlogs = await BlogRepository.find({
        where: {
          author: existingUser,
          isDraft: true,
        },
        order: {
          createdAt: "DESC",
        },
        take: 20,
        skip: (pageNumber - 1) * this.pageSize,
      });

      return { blogs: getDraftBlogs, totalLength: totalBlogsLength };
    } catch (error) {
      throw error;
    }
  }

  async getAllPublishedBlogs(pageNumber: number = 1): Promise<any> {
    try {
      const totalBlogsLength = await BlogRepository.count({
        where: { published: true },
      });

      const publishedBlogs = await BlogRepository.find({
        where: { published: true },
        order: {
          createdAt: "DESC",
        },
        take: 20,
        skip: (pageNumber - 1) * this.pageSize,
      });
      return { blogs: publishedBlogs, totalLength: totalBlogsLength };
    } catch (err) {
      throw err;
    }
  }

  async getBlogsByUserId(userId: number, pageNumber: number = 1): Promise<any> {
    try {
      const existingUser = await checkUserExists("id", userId);

      const totalBlogs = await BlogRepository.count({
        where: { author: existingUser },
      });

      const userBlogs = await BlogRepository.find({
        where: { author: existingUser },
        order: {
          createdAt: "DESC",
        },
        take: this.pageSize,
        skip: (pageNumber - 1) * this.pageSize,
      });

      return { blogs: userBlogs, totalLength: totalBlogs };
    } catch (err) {
      throw err;
    }
  }

  async getSingleBlog(id: number): Promise<Blogs> {
    try {
      const singleBlog = BlogRepository.findOne({
        where: { id: id },
      });

      return singleBlog;
    } catch (error) {
      throw error;
    }
  }

  async publishBlog(id: number): Promise<boolean> {
    try {
      console.log("id " + id);
      const existingBlog = await BlogRepository.findOneBy({ id: id });
      if (!existingBlog) {
        throw new BadRequestError("Blog not found");
      }

      if (existingBlog.published) {
        throw new BadRequestError("Blog already published");
      }
      await BlogRepository.update(
        { id: id },
        { published: true, isDraft: false }
      );

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async searchBlogs(query: string, pageNumber: number = 1): Promise<any> {
    try {
      if (!query) {
        throw new BadRequestError("Query is required");
      }

      const totalBlogs = await BlogRepository.count({
        where: {
          published: true,
        },
      });

      const blogs = await BlogRepository.find({
        where: {
          title: ILike(`%${query}%`),
          published: true,
        },
        order: {
          createdAt: "DESC",
        },
        take: this.pageSize,
        skip: (pageNumber - 1) * this.pageSize,
      });

      return { blogs: blogs, totalLength: totalBlogs };
    } catch (error) {
      throw error;
    }
  }

  updateBlog(id: number, blog: any): Promise<Blogs> {
    throw new Error("Method not implemented.");
  }
  deleteBlog(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
