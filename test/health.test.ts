import request from "supertest";
import app from "../src/app";

describe("GET /api/v1/health", () => {
    it("should return 200 status code", async () => {
        // Act
        const response: request.Response = await request(app).get("/api/v1/health");

        // Assert
        expect(response.status).toBe(200);
    });

    it("should return a JSON response with required fields", async () => {
        // Act
        const response: request.Response = await request(app).get("/api/v1/health");

        // Assert
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("uptime");
        expect(response.body).toHaveProperty("timestamp");
        expect(response.body).toHaveProperty("version");
    });
});