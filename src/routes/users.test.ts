import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma";

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: "testuser@example.com" } });
});

describe("Register Route", () => {
  it("should register a new user successfully", async () => {
    const response = await request(app).post("/api/user/register").send({
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      password: "testingpassword321",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Usuário registrado com sucesso."
    );
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app).post("/api/user/register").send({
      email: "testuser@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Dados inválidos.");
  });

  it("should return 400 if already exist user", async () => {
    const response = await request(app).post("/api/user/register").send({
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      password: "password456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Usuário já existe.");
  });

  it("should return 500 if an unexpected error occurs during register", async () => {
    const spy = jest.spyOn(prisma.user, "findUnique").mockImplementation(() => {
      throw new Error("DB error");
    });

    const response = await request(app).post("/api/user/register").send({
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      password: "testingpassword321",
    });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Erro ao registrar usuário.");
    spy.mockRestore();
  });
});

describe("Login Route", () => {
  it("should log in successfully with valid credentials", async () => {
    const response = await request(app).post("/api/user/login").send({
      email: "testuser@example.com",
      password: "testingpassword321",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return 404 if the user does not exist", async () => {
    const response = await request(app).post("/api/user/login").send({
      email: "nonexistentuser@example.com",
      password: "password123",
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Usuário não encontrado.");
  });

  it("should return 401 if the password is incorrect", async () => {
    const response = await request(app).post("/api/user/login").send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Credenciais inválidas.");
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app).post("/api/user/login").send({
      email: "missingpassword@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Dados inválidos.");
  });

  it("should return 500 if an unexpected error occurs during login", async () => {
    const spy = jest.spyOn(prisma.user, "findUnique").mockImplementation(() => {
      throw new Error("DB error");
    });

    const response = await request(app).post("/api/user/login").send({
      email: "testuser@example.com",
      password: "testingpassword321",
    });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Erro ao fazer login.");
    spy.mockRestore();
  });
});
