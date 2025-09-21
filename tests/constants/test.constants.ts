import { CreateUserDto } from "../../src/dto/create-user.dto";
import { Blogs } from "../../src/entity/Blog";
import { User } from "../../src/entity/User/User";
import { Roles } from "../../src/enum/roles.enum";

export const user: User = {
  id: 1,
  email: "1",
  password: "1",
  createdAt: new Date(),
  updatedAt: new Date(),
  avatarUrl: "1",
  firstName: "1",
  lastName: "1",
  isActive: true,
  role: Roles.USER,
};

export const authRequest = {
  email: "1",
  password: "1",
};

export const authResponse = {
  token: "1",
  message: "1",
};

export const userDto: CreateUserDto = {
  firstName: "1",
  lastName: "1",
  email: "a@g.com",
  password: "1212",
};

export const blog: Blogs = {
  id: 1,
  title: "1",
  summary: "1",
  content: "1",
  createdAt: new Date(),
  updatedAt: new Date(),
  image_url: "1",
  tags: "1",
  readTime: 1,
  published: true,
  isDraft: false,
  author: user,
};
