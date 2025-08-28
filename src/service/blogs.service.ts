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

      console.log(newBlog);

      return await BlogRepository.save(newBlog);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllBlogs(pageNumber: number = 1): Promise<Blogs[]> {
    try {
      const allBlogs = await BlogRepository.find({
        order: {
          createdAt: "DESC",
        },
        take: 20,
        skip: (pageNumber - 1) * this.pageSize,
      });
      return allBlogs;
    } catch (error) {
      throw error;
    }
  }

  async getDraftBlogs(
    userId: number,
    pageNumber: number = 1
  ): Promise<Blogs[]> {
    try {
      const existingUser = await checkUserExists("id", userId);

      const getDraftBlogs = await BlogRepository.find({
        where: {
          author: existingUser,
          published: false,
        },
        order: {
          createdAt: "DESC",
        },
        take: 20,
        skip: (pageNumber - 1) * this.pageSize,
      });

      return getDraftBlogs;
    } catch (error) {
      throw error;
    }
  }

  async getAllPublishedBlogs(pageNumber: number = 1): Promise<Blogs[]> {
    try {
      const publishedBlogs = await BlogRepository.find({
        where: { published: true },
        order: {
          createdAt: "DESC",
        },
        take: 20,
        skip: (pageNumber - 1) * this.pageSize,
      });
      return publishedBlogs;
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

  getSingleBlog(id: number): Promise<Blogs> {
    try {
      const singleBlog = BlogRepository.findOne({
        where: { id: id },
      });

      return singleBlog;
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
