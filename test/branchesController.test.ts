import { Request, Response, NextFunction } from "express";
import * as branchesController from "../src/api/v1/controllers/branchesController";
import * as branchesServices from "../src/api/v1/services/branchesServices";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { Branch } from "../src/api/v1/models/branchModel";

// Mock the entire service module
jest.mock("../src/api/v1/services/branchesServices");

describe("Branches Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            params: {},
            body: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllBranches", () => {
        it("should return all branches with 200 status", async () => {
            // Arrange
            const mockBranches: Branch[] = [
                {
                    id: "abc123",
                    name: "Downtown Branch",
                    address: "123 Main St",
                    phone: "204-555-5555"
                },
                {
                    id: "def456",
                    name: "Fort Gary Branch",
                    address: "456 Pembina Hwy",
                    phone: "204-555-6666"
                }
            ];
            (branchesServices.getAllBranches as jest.Mock).mockResolvedValue(mockBranches);

            // Act
            await branchesController.getAllBranches(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(branchesServices.getAllBranches).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: mockBranches,
                message: "Branches retrieved successfully"
            });
        });

        it("should call next with error when service throws", async () => {
            // Arrange
            const mockError: Error = new Error("Database error");
            (branchesServices.getAllBranches as jest.Mock).mockRejectedValue(mockError);

            // Act
            await branchesController.getAllBranches(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
        });
    });

    describe("getBranchById", () => {
        it("should return branch with 200 status when found", async () => {
            // Arrange
            const mockBranch: Branch = {
                id: "abc123",
                name: "Downtown Branch",
                address: "123 Main St",
                phone: "204-555-5555"
            };
            mockReq.params = { id: "abc123" };
            (branchesServices.getBranchById as jest.Mock).mockResolvedValue(mockBranch);

            // Act
            await branchesController.getBranchById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(branchesServices.getBranchById).toHaveBeenCalledWith("abc123");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: mockBranch,
                message: "Branch retrieved successfully"
            });
        });

        it("should return 404 when branch not found", async () => {
            // Arrange
            mockReq.params = { id: "xyz999" };
            (branchesServices.getBranchById as jest.Mock).mockResolvedValue(undefined);

            // Act
            await branchesController.getBranchById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(branchesServices.getBranchById).toHaveBeenCalledWith("xyz999");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "Branch not found"
            });
        });

        it("should call next with error when service throws", async () => {
            // Arrange
            mockReq.params = { id: "abc123" };
            const mockError: Error = new Error("Database error");
            (branchesServices.getBranchById as jest.Mock).mockRejectedValue(mockError);

            // Act
            await branchesController.getBranchById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("createBranch", () => {
        it("should create branch and return 201 status", async () => {
            // Arrange
            const branchData: {
                name: string;
                address: string;
                phone: string;
            } = {
                name: "Downtown Branch",
                address: "123 Main St",
                phone: "204-555-5555"
            };
            const createdBranch: Branch = {
                id: "abc123",
                ...branchData
            };
            mockReq.body = branchData;
            (branchesServices.createBranch as jest.Mock).mockResolvedValue(createdBranch);

            // Act
            await branchesController.createBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(branchesServices.createBranch).toHaveBeenCalledWith(branchData);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: createdBranch,
                message: "Branch created successfully"
            });
        });

        it("should call next with error when service throws", async () => {
            // Arrange
            mockReq.body = {
                name: "Downtown Branch",
                address: "123 Main St",
                phone: "204-555-5555"
            };
            const mockError: Error = new Error("Database error");
            (branchesServices.createBranch as jest.Mock).mockRejectedValue(mockError);

            // Act
            await branchesController.createBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("updateBranch", () => {
        it("should update branch and return 200 status", async () => {
            // Arrange
            const updateData: {
                address: string;
                phone: string;
            } = {
                address: "999 New St",
                phone: "204-555-9999"
            };
            const updatedBranch: Branch = {
                id: "abc123",
                name: "Downtown Branch",
                address: "999 New St",
                phone: "204-555-7777"
            };
            mockReq.params = { id: "abc123" };
            mockReq.body = updateData;
            (branchesServices.updateBranch as jest.Mock).mockResolvedValue(updatedBranch);

            // Act
            await branchesController.updateBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(branchesServices.updateBranch).toHaveBeenCalledWith("abc123", updateData);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: updatedBranch,
                message: "Branch updated successfully"
            });
        });

        it("should return 404 when branch not found", async () => {
            // Arrange
            mockReq.params = { id: "xyz999" };
            mockReq.body = { address: "999 New St" };
            (branchesServices.updateBranch as jest.Mock).mockResolvedValue(null);

            // Act
            await branchesController.updateBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "Branch not found"
            });
        });

        it("should call next with error when service throws", async () => {
            // Arrange
            mockReq.params = { id: "abc123" };
            mockReq.body = { address: "999 New St" };
            const mockError: Error = new Error("Database error");
            (branchesServices.updateBranch as jest.Mock).mockRejectedValue(mockError);

            // Act
            await branchesController.updateBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("deleteBranch", () => {
        it("should delete branch and return 200 status", async () => {
            // Arrange
            mockReq.params = { id: "abc123" };
            (branchesServices.deleteBranch as jest.Mock).mockResolvedValue(true);

            // Act
            await branchesController.deleteBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(branchesServices.deleteBranch).toHaveBeenCalledWith("abc123");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: {},
                message: "Branch deleted successfully"
            });
        });

        it("should return 404 when branch not found", async () => {
            // Arrange
            mockReq.params = { id: "xyz999" };
            (branchesServices.deleteBranch as jest.Mock).mockResolvedValue(false);

            // Act
            await branchesController.deleteBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "Branch not found"
            });
        });

        it("should call next with error when service throws", async () => {
            // Arrange
            mockReq.params = { id: "abc123" };
            const mockError: Error = new Error("Database error");
            (branchesServices.deleteBranch as jest.Mock).mockRejectedValue(mockError);

            // Act
            await branchesController.deleteBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });
});