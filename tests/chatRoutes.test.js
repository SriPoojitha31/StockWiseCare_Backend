import request from "supertest";
import app from "../server.js"; // your Express app
import mongoose from "mongoose";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Chat Routes", () => {
  it("should create a new chat", async () => {
    const res = await request(app)
      .post("/api/chat/create")
      .send({
        userId: "661f22d97d9322c4a42f08bc", // test user
        message: "Hello, this is a test chat!",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("message");
  });
});
