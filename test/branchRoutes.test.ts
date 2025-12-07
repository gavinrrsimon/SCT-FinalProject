import request from "supertest";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import app from "../src/app";
import * as branchesController from "../src/api/v1/controllers/branchesController";

jest.mock("../src/api/v1/controllers/branchesController", () => ({
    getAllBranches: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getBranchById: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    createBranch: jest.fn((req, res) => res.status(HTTP_STATUS.CREATED).send()),
    updateBranch: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    deleteBranch: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Branch Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/branches", () => {
        it("should call getAllBranches controller", async () => {
            await request(app).get("/api/v1/branches");
            expect(branchesController.getAllBranches).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/branches/:id", () => {
        it("should call getBranchById controller", async () => {
            await request(app).get("/api/v1/branches/abc123");
            expect(branchesController.getBranchById).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/branches", () => {
        it("should call createBranch controller with valid data", async () => {
            const mockBranch: {
                name: string;
                address: string;
                phone: string;
            } = {
                name: "Downtown Branch",
                address: "123 Main St",
                phone: "204-555-0001"
            };

            await request(app).post("/api/v1/branches").send(mockBranch);
            expect(branchesController.createBranch).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/branches/:id", () => {
        it("should call updateBranch controller with valid data", async () => {
            const mockUpdate: {
                address: string;
                phone: string;
            } = {
                address: "999 New St",
                phone: "204-555-9999"
            };

            await request(app).put("/api/v1/branches/abc123").send(mockUpdate);
            expect(branchesController.updateBranch).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/branches/:id", () => {
        it("should call deleteBranch controller", async () => {
            await request(app).delete("/api/v1/branches/abc123");
            expect(branchesController.deleteBranch).toHaveBeenCalled();
        });
    });
});