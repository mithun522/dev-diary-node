import { Blogs } from "../../entity/Blog";

export interface BlogServiceIntervface {
  createBlogs(blog: any, userId: number): Promise<Blogs>;
  getAllBlogs(pageNumber: number): Promise<Blogs[]>;
  getDraftBlogs(userId: number, pageNumber: number): Promise<Blogs[]>;
  getAllPublishedBlogs(pageNumber: number): Promise<Blogs[]>;
  getBlogsByUserId(userId: number, pageNumber: number): Promise<Blogs[]>;
  getSingleBlog(id: number): Promise<Blogs>;
  publishBlog(id: number): Promise<boolean>;
  searchBlogs(query: string): Promise<Blogs[]>;
  updateBlog(id: number, blog: any): Promise<Blogs>;
  deleteBlog(id: number): Promise<void>;
}
