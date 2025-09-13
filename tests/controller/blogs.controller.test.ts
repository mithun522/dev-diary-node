import { BlogsController } from "../../src/controller/blogs.controller";
import { BlogsService } from "../../src/service/blogs.service";
import { blog } from "../constants/test.constants";
import { Response, NextFunction } from "express";

// Mocked response object
const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
};

describe("Blog controller tests", () => {
  let blogsService: BlogsService;
  let blogsController: BlogsController;
  let req: any;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    blogsService = new BlogsService();
    blogsController = new BlogsController();

    // override private service with mock instance
    (blogsController as any).blogsService = blogsService;

    res = mockResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  test("should create a blog and return 201 with response", async () => {
    jest.spyOn(blogsService, "createBlogs").mockResolvedValue(blog);

    req = {
      body: { title: "My Blog", content: "Content here" },
      user: { id: 1 },
      file: { filename: "image.png" },
    };

    await blogsController.createBlogs(req, res, next);

    expect(blogsService.createBlogs).toHaveBeenCalledWith(
      {
        title: "My Blog",
        content: "Content here",
        image_url: "/uploads/image.png",
      },
      1
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(blog);
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next(err) if service throws", async () => {
    const error = new Error("DB error");
    jest.spyOn(blogsService, "createBlogs").mockRejectedValue(error);

    req = {
      body: { title: "Fail Blog" },
      user: { id: 1 },
    };

    await blogsController.createBlogs(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
