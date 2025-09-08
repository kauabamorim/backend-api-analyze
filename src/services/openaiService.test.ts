import jwt from "jsonwebtoken";
import app from "../app";
import request from "supertest";
import prisma from "../lib/prisma";

describe("OpenAI Service", () => {
  const token = "fake-jwt-token";

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 400 if required fields are missing", async () => {
    jest.spyOn(jwt, "verify").mockImplementation((t, secret, cb: any) =>
      cb(null, {
        id: "user123",
        email: "test@example.com",
        plan: "FREE",
        name: "Test User",
      })
    );

    const res = await request(app)
      .post("/api/analyze")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Invalid request body.",
      issues: [
        {
          code: "invalid_type",
          expected: "object",
          message: "Required",
          path: [],
          received: "undefined",
        },
      ],
    });
  });
});
