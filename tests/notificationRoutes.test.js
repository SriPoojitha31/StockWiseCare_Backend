describe("Notifications", () => {
    it("should fetch notifications", async () => {
      const res = await request(app).get("/api/notifications");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
  