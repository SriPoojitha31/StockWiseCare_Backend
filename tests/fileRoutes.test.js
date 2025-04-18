describe("File Upload Route", () => {
    it("should return 400 for missing file", async () => {
      const res = await request(app).post("/api/files/upload");
      expect(res.statusCode).toBe(400);
    });
  });
  