import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app";
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

jest.mock("../mappers/analyzeMapper.ts", () => ({
  analyzeIdeasMap: jest.fn((idea) => ({ ...idea, mapped: true })),
}));

describe("History Route", () => {
  const token = "fake-jwt-token";

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 401 if token is not provided", async () => {
    const res = await request(app).get("/api/user/history");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Token não fornecido" });
  });

  it("should return empty array if user has no ideas", async () => {
    jest.spyOn(jwt, "verify").mockImplementation((t, secret, cb: any) =>
      cb(null, {
        id: "user123",
        email: "test@example.com",
        plan: "FREE",
        name: "Test User",
      })
    );

    jest.spyOn(prisma.idea, "findMany").mockResolvedValue([]);

    const res = await request(app)
      .get("/api/user/history")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return mapped ideas for authenticated user", async () => {
    jest.spyOn(jwt, "verify").mockImplementation((t, secret, cb: any) =>
      cb(null, {
        id: "user123",
        email: "test@example.com",
        plan: "FREE",
        name: "Test User",
      })
    );

    const ideasMock = [
      {
        id: "1",
        idea: "Idea 1",
        createdAt: new Date().toISOString(),
        userId: "user123",
      },
      {
        id: "2",
        idea: "Idea 2",
        createdAt: new Date().toISOString(),
        userId: "user123",
      },
    ];

    jest.spyOn(prisma.idea, "findMany").mockResolvedValue(ideasMock as any);

    const res = await request(app)
      .get("/api/user/history")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { ...ideasMock[0], mapped: true },
      { ...ideasMock[1], mapped: true },
    ]);
  });

  it("should return 500 if prisma throws error", async () => {
    jest.spyOn(jwt, "verify").mockImplementation((t, secret, cb: any) =>
      cb(null, {
        id: "user123",
        email: "test@example.com",
        plan: "FREE",
        name: "Test User",
      })
    );

    jest
      .spyOn(prisma.idea, "findMany")
      .mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .get("/api/user/history")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Erro ao buscar histórico de ideias." });
  });
});
