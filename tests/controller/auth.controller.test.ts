import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../src/service/auth.service";
import { AuthController } from "../../src/controller/auth.controller";
import { authRequest, authResponse, user } from "../constants/test.constants";

const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("Auth controller tests", () => {
  let authService = new AuthService();
  let authController = new AuthController();
  beforeEach(() => {
    authService = new AuthService();
    authController = new AuthController();
    authController.authService = authService;
  });

  test("Create user", async () => {
    authService.createUser = jest.fn().mockResolvedValue(user);

    const req = { body: user } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await authController.createUser(req, res, next);
    expect(res.json).toHaveBeenCalledWith(user);
    expect(next).not.toHaveBeenCalled();
  });

  test("handle error in create user", async () => {
    const error = new Error();
    authService.createUser = jest.fn().mockRejectedValue(error);

    const req = { body: user } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await authController.createUser(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  test("Login user", async () => {
    authService.login = jest.fn().mockResolvedValue({ authResponse });

    const req = { body: { authRequest } } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await authController.login(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ authResponse });
    expect(next).not.toHaveBeenCalled();
  });

  test("handle error in login user", async () => {
    const error = new Error();
    authService.login = jest.fn().mockRejectedValue(error);

    const req = { body: { authRequest } } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await authController.login(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  test("Send Otp", async () => {
    authService.sendOtp = jest.fn().mockResolvedValue({ authResponse });

    const req = { body: { authRequest } } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await authController.sendOtp(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ authResponse });
    expect(next).not.toHaveBeenCalled();
  });

  test("handle error in send otp", async () => {
    const error = new Error();
    authService.sendOtp = jest.fn().mockRejectedValue(error);

    const req = { body: { authRequest } } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await authController.sendOtp(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  test("Verify Otp", async () => {
    authService.verifyOtp = jest.fn().mockResolvedValue({ authResponse });

    const req = { body: { authRequest } } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await authController.verifyOtp(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ authResponse });
    expect(next).not.toHaveBeenCalled();
  });

  test("handle error in verify otp", async () => {
    const error = new Error();
    authService.verifyOtp = jest.fn().mockRejectedValue(error);

    const req = { body: { authRequest } } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await authController.verifyOtp(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  test("Reset Password", async () => {
    authService.resetPassword = jest.fn().mockResolvedValue({ authResponse });

    const req = { body: { authRequest } } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await authController.resetPassword(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ authResponse });
    expect(next).not.toHaveBeenCalled();
  });

  test("handle error in reset password", async () => {
    const error = new Error();
    authService.resetPassword = jest.fn().mockRejectedValue(error);

    const req = { body: { authRequest } } as Request;
    const res = mockResponse();
    const next = jest.fn();

    await authController.resetPassword(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
