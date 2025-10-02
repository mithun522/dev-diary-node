import { DeleteResult } from "typeorm";
import { Blogs } from "../../entity/Blog";

export interface PaginatedBlogs {
  blogs: Blogs[];
  totalLength: number;
}

export interface IBlogService {
  createBlogs(blog: any, userId: number): Promise<Blogs>;
  getAllBlogs(pageNumber: number): Promise<PaginatedBlogs>;
  getDraftBlogs(userId: number, pageNumber: number): Promise<PaginatedBlogs>;
  getAllPublishedBlogs(pageNumber: number): Promise<PaginatedBlogs>;
  getBlogsByUserId(userId: number, pageNumber: number): Promise<PaginatedBlogs>;
  getSingleBlog(id: number): Promise<Blogs>;
  publishBlog(id: number): Promise<boolean>;
  searchBlogs(query: string): Promise<Blogs[]>;
  updateBlog(id: number, blog: any, userId: number): Promise<Blogs>;
  deleteBlog(id: number, userId: number): Promise<DeleteResult>;
}
