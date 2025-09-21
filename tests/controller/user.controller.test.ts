import { describe, expect, test } from "@jest/globals";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../../src/service/User.service";
import { UserController } from "../../src/controller/User.controller";
import { User } from "../../src/entity/User/User";
import { user } from "../constants/test.constants";

const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};
const mockNext: NextFunction = jest.fn();
const users = [user];
const updateUser: Partial<User> = {
  firstName: "hello",
  lastName: "world",
  email: "hellow@gmail.com",
};

describe("User controller tests", () => {
  let userService: UserService;
  let userController: UserController;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    userService = new UserService();
    userController = new UserController();
    userController.userService = userService;

    req = {} as Request;
    res = mockResponse();
    next = jest.fn();
  });

  test("Get all users", async () => {
    userService.getAllUser = jest.fn().mockResolvedValue(users);

    userController.userService = userService;

    const req = {} as Request;
    const res = mockResponse();

    await userController.getAllUser(req, res, mockNext);
    expect(res.json).toHaveBeenCalledWith(users);
    expect(mockNext).not.toHaveBeenCalled();
  });

  test("Handle error and call next middleware", async () => {
    const error = new Error();
    userService.getAllUser = jest.fn().mockRejectedValue(error);
    const req = {} as Request;
    const res = mockResponse();

    await userController.getAllUser(req, res, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  test("Get Single User", async () => {
    userService.getSingleUser = jest.fn().mockResolvedValue(users[0]);

    const req = { params: { id: "1" } } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await userController.getSingleUser(req, res, next);
    expect(res.json).toHaveBeenCalledWith(users[0]);
    expect(next).not.toHaveBeenCalled();
  });

  test("handle error in get single user", async () => {
    const error = new Error();
    userService.getSingleUser = jest.fn().mockRejectedValue(error);

    const req = { params: { id: null } } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await userController.getSingleUser(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  test("Update user", async () => {
    userService.updateUser = jest.fn().mockResolvedValue(updateUser);

    const req = { params: { id: 1 }, body: { updateUser } } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await userController.updateUser(req, res, next);
    expect(res.json).toHaveBeenCalledWith(updateUser);
    expect(next).not.toHaveBeenCalled();
  });

  test("handle error in update user", async () => {
    const error = new Error();
    userService.updateUser = jest.fn().mockRejectedValue(error);

    const req = { params: { id: null }, body: updateUser } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await userController.updateUser(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  test("Delete user", async () => {
    userService.deleteUser = jest.fn().mockResolvedValue(users[0].id);

    const req = { params: { id: users[0].id } } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await userController.deleteUser(req, res, next);
    expect(res.json).toHaveBeenCalledWith(users[0].id);
    expect(next).not.toHaveBeenCalled();
  });

  test("handle error in delete user", async () => {
    const error = new Error();
    userService.deleteUser = jest.fn().mockRejectedValue(error);

    const req = { params: { id: null } };
    const res = mockResponse();
    const next = jest.fn();

    await userController.deleteUser(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
