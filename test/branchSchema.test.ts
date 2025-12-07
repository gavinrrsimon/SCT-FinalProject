import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validate";
import { branchSchemas } from "../src/api/v1/validation/branchSchemas";
import { MiddlewareFunction } from "../src/api/v1/types/express";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("Validation Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    describe("branchSchema.create", () => {
        it("should pass validation for valid branch data", () => {
            // Arrange
            mockReq.body = {
                name: "Downtown Branch",
                address: "123 Main St",
                phone: "204-555-5555"
            };

            const middleware: MiddlewareFunction = validateRequest(
                branchSchemas.create
            );

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it("should fail validation when name is empty string", () => {
            // Arrange
            mockReq.body = {
                name: "",
                address: "123 Main St",
                phone: "204-555-5555"
            };

            const middleware: MiddlewareFunction = validateRequest(
                branchSchemas.create
            );

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "Validation error: Body: Branch name cannot be empty",
            });
        });
    });

    describe("branchSchema.getById", () => {
        it("should validate correct id parameter", () => {
            // Arrange
            mockReq.params = {
                "id": "123abc"
            }

            const middleware: MiddlewareFunction = validateRequest(
                branchSchemas.getById
            );

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it("should reject empty id", () => {
            // Arrange
            mockReq.params = { "id": "" };

            const middleware: MiddlewareFunction = validateRequest(
                branchSchemas.getById
            )

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "Validation error: Params: Branch ID cannot be empty",
            });
        });
    });

    describe("branchSchema.update", () => {
        it("should validate correct update data", () => {
            // Arrange
            mockReq.params = {
                "id": "123abc"
            }

            mockReq.body = {
                "name": "South Branch"
            }

            const middleware: MiddlewareFunction = validateRequest(
                branchSchemas.update
            );

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });

        it("should reject update with no fields", () => {
            // Arrange
            mockReq.params = {
                "id": "123abcd"
            };

            mockReq.body = {
                name: ""
            }

            const middleware: MiddlewareFunction = validateRequest(
                branchSchemas.update
            )

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "Validation error: Body: Branch name cannot be empty",
            });
        });
    });

    describe("branchSchema.delete", () => {
        it("should validate correct delete request", () => {
            // Arrange
            mockReq.params = {
                "id": "123abc"
            }

            const middleware: MiddlewareFunction = validateRequest(
                branchSchemas.delete
            );

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });
    });

    describe("branchSchema.list", () => {
        it("should validate list request", () => {
            // Arrange
            const middleware: MiddlewareFunction = validateRequest(
                branchSchemas.list
            );
    
            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);
    
            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });
    });
});