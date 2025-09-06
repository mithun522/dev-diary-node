import { Response, Request, NextFunction, AuthenticatedRequest } from "express";
import { BlogsService } from "../service/blogs.service";

export class BlogsController {
  private blogsService = new BlogsService();

  async createBlogs(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = Number(req?.user.id);

      const blogData = req.body;

      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

      const blog = await this.blogsService.createBlogs(
        { ...blogData, image_url: imagePath },
        userId
      );

      return res.status(201).json(blog);
    } catch (err: any) {
      next(err);
    }
  }

  async getAllBlogs(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pageNumber = req.query?.page || 1;
      const userId = req?.user?.id;
      const allBlogs = await this.blogsService.getAllBlogs(userId, pageNumber);
      return res.json(allBlogs);
    } catch (err: any) {
      next(err);
    }
  }

  async getPublishedBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const pageNumber = req.query?.page || 1;
      const publishedBlogs = await this.blogsService.getAllPublishedBlogs(
        pageNumber
      );
      return res.json(publishedBlogs);
    } catch (err) {
      next(err);
    }
  }

  async getSingleBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const blog = await this.blogsService.getSingleBlog(req?.params.id);
      return res.json(blog);
    } catch (err) {
      next(err);
    }
  }

  async getDraftBlogs(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pageNumber = req.query?.page || 1;
      const userId = req.user?.id;
      const draftedBlogs = await this.blogsService.getDraftBlogs(
        userId,
        pageNumber
      );
      res.json(draftedBlogs);
    } catch (err) {
      next(err);
    }
  }

  async getBlogsByUserId(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pageNumber = req.query?.page || 1;
      const userId = req.user?.id;
      const blogs = await this.blogsService.getBlogsByUserId(
        userId,
        pageNumber
      );
      res.json(blogs);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async publishBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const blogId = Number(req.params?.id);
      const blog = await this.blogsService.publishBlog(blogId);
      return res.json(blog);
    } catch (err) {
      next(err);
    }
  }

  async searchBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, page } = req.query;
      const blogs = await this.blogsService.searchBlogs(search, page);
      return res.json(blogs);
    } catch (err) {
      next(err);
    }
  }
}
