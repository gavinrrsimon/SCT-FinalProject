import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validate";
import { employeeSchemas } from "../src/api/v1/validation/employeeSchemas";
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

    describe("employeeSchemas.create", () => {
        it("should pass validation for valid employee data", () => {
            // Arrange
            mockReq.body = {
                name: "John Doe",
                position: "Developer",
                department: "IT",
                email: "john@test.com",
                phone: "204-123-4567",
                branchId: 1
            };
    
            const middleware: MiddlewareFunction = validateRequest(
                employeeSchemas.create
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
                position: "Developer",
                department: "IT",
                email: "john@test.com",
                phone: "204-123-4567",
                branchId: 1
            };

            const middleware: MiddlewareFunction = validateRequest(
                employeeSchemas.create
            );

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "Validation error: Body: Employee name cannot be empty",
            });
        });
    });

    describe("employeeSchemas.getById", () => {
        it("should validate correct id parameter", () => {
            // Arrange
            mockReq.params = {
                "id": "123abc"
            }

            const middleware: MiddlewareFunction = validateRequest(
                employeeSchemas.getById
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
                employeeSchemas.getById
            )

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "Validation error: Params: Employee ID cannot be empty",
            });
        });
    });

    describe("employeeSchemas.update", () => {
        it("should validate correct update data", () => {
            // Arrange
            mockReq.params = {
                "id": "123abc"
            }

            mockReq.body = {
                "name": "Jane Doe"
            }

            const middleware: MiddlewareFunction = validateRequest(
                employeeSchemas.update
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
                employeeSchemas.update
            )

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "Validation error: Body: Employee name cannot be empty",
            });
        });
    });

    describe("employeeSchemas.delete", () => {
        it("should validate correct delete request", () => {
            // Arrange
            mockReq.params = {
                "id": "123abc"
            }

            const middleware: MiddlewareFunction = validateRequest(
                employeeSchemas.delete
            );

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });
    });

    describe("employeeSchemas.list", () => {
        it("should validate list request", () => {
            // Arrange
            const middleware: MiddlewareFunction = validateRequest(
                employeeSchemas.list
            );
    
            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);
    
            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });
    });

    describe("employeeSchemas.getByBranch", () => {
        it("should validate correct branchId parameter", () => {
            // Arrange
            mockReq.params = { branchId: "1" };
    
            const middleware: MiddlewareFunction = validateRequest(
                employeeSchemas.getByBranch
            );
    
            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);
    
            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });
    
        it("should reject invalid branchId", () => {
            // Arrange
            mockReq.params = { "branchId": "" };

            const middleware: MiddlewareFunction = validateRequest(
                employeeSchemas.getByBranch
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
    
    describe("employeeSchemas.getByDepartment", () => {
        it("should validate correct department parameter", () => {
            // Arrange
            mockReq.params = {
                "department": "IT"
            }
    
            const middleware: MiddlewareFunction = validateRequest(
                employeeSchemas.getByDepartment
            );
    
            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);
    
            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
        });
    
        it("should reject invalid department", () => {
            // Arrange
            mockReq.params = { "department": "" };

            const middleware: MiddlewareFunction = validateRequest(
                employeeSchemas.getByDepartment
            )

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "Validation error: Params: Department cannot be empty",
            });
        });
    });
});