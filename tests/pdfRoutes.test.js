describe("PDF Routes", () => {
    it("should generate a PDF", async () => {
      const res = await request(app).post("/api/pdf/generate").send({
        content: "This is test content",
      });
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("pdfUrl");
    });
  });
  