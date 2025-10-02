import { plainToInstance } from "class-transformer";
import { Blogs } from "../entity/Blog";
import { BlogRepository } from "../repository/blog.repo";
import {
  checkForAllRequiredFields,
  checkUserExists,
  validateEntity,
} from "../utils/user-validation.utils";
import {
  IBlogService,
  PaginatedBlogs,
} from "./service-interface/Iblog.service";
import { BadRequestError } from "../error/bad-request.error";
import { DeleteResult, ILike } from "typeorm";
import { NotFoundError } from "../error/not-found.error";

export class BlogsService implements IBlogService {
  constructor(private blogRepo: typeof BlogRepository, private pageSize = 10) {}

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

      return await this.blogRepo.save(newBlog);
    } catch (error) {
      throw error;
    }
  }

  async getAllBlogs(
    userId: number,
    pageNumber: number = 1
  ): Promise<PaginatedBlogs> {
    try {
      const queryBuilder = this.blogRepo
        .createQueryBuilder("blog")
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

  async getDraftBlogs(
    userId: number,
    pageNumber: number = 1
  ): Promise<PaginatedBlogs> {
    try {
      const existingUser = await checkUserExists("id", userId);

      const totalBlogsLength = await this.blogRepo.count({
        where: { isDraft: true },
      });

      const getDraftBlogs = await this.blogRepo.find({
        where: {
          author: existingUser,
          isDraft: true,
        },
        order: {
          createdAt: "DESC",
        },
        take: this.pageSize,
        skip: (pageNumber - 1) * this.pageSize,
      });

      return { blogs: getDraftBlogs, totalLength: totalBlogsLength };
    } catch (error) {
      throw error;
    }
  }

  async getAllPublishedBlogs(pageNumber: number = 1): Promise<PaginatedBlogs> {
    try {
      const totalBlogsLength = await this.blogRepo.count({
        where: { published: true },
      });

      const publishedBlogs = await this.blogRepo.find({
        where: { published: true },
        order: {
          createdAt: "DESC",
        },
        take: this.pageSize,
        skip: (pageNumber - 1) * this.pageSize,
      });
      return { blogs: publishedBlogs, totalLength: totalBlogsLength };
    } catch (err) {
      throw err;
    }
  }

  async getBlogsByUserId(
    userId: number,
    pageNumber: number = 1
  ): Promise<PaginatedBlogs> {
    try {
      const existingUser = await checkUserExists("id", userId);

      const totalBlogs = await this.blogRepo.count({
        where: { author: existingUser },
      });

      const userBlogs = await this.blogRepo.find({
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
      const singleBlog = this.blogRepo.findOne({
        where: { id: id },
      });

      return singleBlog;
    } catch (error) {
      throw error;
    }
  }

  async publishBlog(id: number): Promise<boolean> {
    try {
      const existingBlog = await this.blogRepo.findOneBy({ id: id });
      if (!existingBlog) {
        throw new BadRequestError("Blog not found");
      }

      if (existingBlog.published) {
        throw new BadRequestError("Blog already published");
      }
      await this.blogRepo.update(
        { id: id },
        { published: true, isDraft: false }
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  async searchBlogs(query: string, pageNumber: number = 1): Promise<any> {
    try {
      if (!query) {
        throw new BadRequestError("Query is required");
      }

      const totalBlogs = await this.blogRepo.count({
        where: {
          published: true,
        },
      });

      const blogs = await this.blogRepo.find({
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

  async updateBlog(id: number, blog: Blogs, userId: number): Promise<Blogs> {
    try {
      if (!id) {
        throw new BadRequestError("id is required");
      }

      const existingBlog = await this.blogRepo.findOne({
        where: { author: { id: userId }, id: id },
      });

      if (!existingBlog) {
        throw new NotFoundError("Blog not found");
      }

      const updatedBlog = this.blogRepo.merge(existingBlog, blog);
      return await this.blogRepo.save(updatedBlog);
    } catch (error) {
      throw error;
    }
  }
  async deleteBlog(id: number, userId: number): Promise<DeleteResult> {
    try {
      if (!id) {
        throw new BadRequestError("id is required");
      }

      const existingBlog = await this.blogRepo.findOne({
        where: { author: { id: userId }, id: id },
      });
      if (!existingBlog) {
        throw new NotFoundError("Blog not found");
      }

      const result = await this.blogRepo.delete({ id });

      if (result.affected === 0) {
        throw new NotFoundError("Blog could not be deleted");
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
}
