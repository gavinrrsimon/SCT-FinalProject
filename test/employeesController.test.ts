import { Request, Response, NextFunction } from "express";
import * as employeesController from "../src/api/v1/controllers/employeesController";
import * as employeesServices from "../src/api/v1/services/employeesServices";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { Employee } from "../src/api/v1/models/employeeModel";

// Mock the entire service module
jest.mock("../src/api/v1/services/employeesServices");

describe("Employees Controller", () => {
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

    describe("getAllEmployees", () => {
        it("should return all employees with 200 status", async () => {
            // Arrange
            const mockEmployees: Employee[] = [
                {
                    id: "abc123",
                    name: "John Doe",
                    position: "Developer",
                    department: "IT",
                    email: "john@test.com",
                    phone: "204-123-4567",
                    branchId: 1
                },
                {
                    id: "def456",
                    name: "Jane Smith",
                    position: "Manager",
                    department: "HR",
                    email: "jane@test.com",
                    phone: "204-765-4321",
                    branchId: 2
                }
            ];
            (employeesServices.getAllEmployees as jest.Mock).mockResolvedValue(mockEmployees);

            // Act
            await employeesController.getAllEmployees(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeesServices.getAllEmployees).toHaveBeenCalledTimes(1);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: mockEmployees,
                message: "Employees retrieved successfully"
            });
        });

        it("should call next with error when service throws", async () => {
            // Arrange
            const mockError: Error = new Error("Database error");
            (employeesServices.getAllEmployees as jest.Mock).mockRejectedValue(mockError);

            // Act
            await employeesController.getAllEmployees(
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

    describe("getEmployeeById", () => {
        it("should return employee with 200 status when found", async () => {
            // Arrange
            const mockEmployee: Employee = {
                id: "abc123",
                name: "John Doe",
                position: "Developer",
                department: "IT",
                email: "john@test.com",
                phone: "204-123-4567",
                branchId: 1
            };
            mockReq.params = { id: "abc123" };
            (employeesServices.getEmployeeById as jest.Mock).mockResolvedValue(mockEmployee);

            // Act
            await employeesController.getEmployeeById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeesServices.getEmployeeById).toHaveBeenCalledWith("abc123");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: mockEmployee,
                message: "Employee retrieved successfully"
            });
        });

        it("should return 404 when employee not found", async () => {
            // Arrange
            mockReq.params = { id: "xyz999" };
            (employeesServices.getEmployeeById as jest.Mock).mockResolvedValue(undefined);

            // Act
            await employeesController.getEmployeeById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeesServices.getEmployeeById).toHaveBeenCalledWith("xyz999");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "Employee not found"
            });
        });

        it("should call next with error when service throws", async () => {
            // Arrange
            mockReq.params = { id: "abc123" };
            const mockError: Error = new Error("Database error");
            (employeesServices.getEmployeeById as jest.Mock).mockRejectedValue(mockError);

            // Act
            await employeesController.getEmployeeById(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("createEmployee", () => {
        it("should create employee and return 201 status", async () => {
            // Arrange
            const employeeData: {
                name: string;
                position: string;
                department: string;
                email: string;
                phone: string;
                branchId: number;
            } = {
                name: "John Doe",
                position: "Developer",
                department: "IT",
                email: "john@test.com",
                phone: "204-123-4567",
                branchId: 1
            };
            const createdEmployee: Employee = {
                id: "abc123",
                ...employeeData
            };
            mockReq.body = employeeData;
            (employeesServices.createEmployee as jest.Mock).mockResolvedValue(createdEmployee);

            // Act
            await employeesController.createEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeesServices.createEmployee).toHaveBeenCalledWith(employeeData);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: createdEmployee,
                message: "Employee created successfully"
            });
        });

        it("should call next with error when service throws", async () => {
            // Arrange
            mockReq.body = {
                name: "John Doe",
                position: "Developer",
                department: "IT",
                email: "john@test.com",
                phone: "204-123-4567",
                branchId: 1
            };
            const mockError: Error = new Error("Database error");
            (employeesServices.createEmployee as jest.Mock).mockRejectedValue(mockError);

            // Act
            await employeesController.createEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("updateEmployee", () => {
        it("should update employee and return 200 status", async () => {
            // Arrange
            const updateData: {
                position: string;
                phone: string;
            } = {
                position: "Senior Developer",
                phone: "204-999-9999"
            };
            const updatedEmployee: Employee = {
                id: "abc123",
                name: "John Doe",
                position: "Senior Developer",
                department: "IT",
                email: "john@test.com",
                phone: "204-999-9999",
                branchId: 1
            };
            mockReq.params = { id: "abc123" };
            mockReq.body = updateData;
            (employeesServices.updateEmployee as jest.Mock).mockResolvedValue(updatedEmployee);

            // Act
            await employeesController.updateEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeesServices.updateEmployee).toHaveBeenCalledWith("abc123", updateData);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: updatedEmployee,
                message: "Employee updated successfully"
            });
        });

        it("should return 404 when employee not found", async () => {
            // Arrange
            mockReq.params = { id: "xyz999" };
            mockReq.body = { position: "Senior Developer" };
            (employeesServices.updateEmployee as jest.Mock).mockResolvedValue(null);

            // Act
            await employeesController.updateEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "Employee not found"
            });
        });

        it("should call next with error when service throws", async () => {
            // Arrange
            mockReq.params = { id: "abc123" };
            mockReq.body = { position: "Senior Developer" };
            const mockError: Error = new Error("Database error");
            (employeesServices.updateEmployee as jest.Mock).mockRejectedValue(mockError);

            // Act
            await employeesController.updateEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("deleteEmployee", () => {
        it("should delete employee and return 200 status", async () => {
            // Arrange
            mockReq.params = { id: "abc123" };
            (employeesServices.deleteEmployee as jest.Mock).mockResolvedValue(true);

            // Act
            await employeesController.deleteEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeesServices.deleteEmployee).toHaveBeenCalledWith("abc123");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: {},
                message: "Employee deleted successfully"
            });
        });

        it("should return 404 when employee not found", async () => {
            // Arrange
            mockReq.params = { id: "xyz999" };
            (employeesServices.deleteEmployee as jest.Mock).mockResolvedValue(false);

            // Act
            await employeesController.deleteEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "Employee not found"
            });
        });

        it("should call next with error when service throws", async () => {
            // Arrange
            mockReq.params = { id: "abc123" };
            const mockError: Error = new Error("Database error");
            (employeesServices.deleteEmployee as jest.Mock).mockRejectedValue(mockError);

            // Act
            await employeesController.deleteEmployee(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("getEmployeeByBranch", () => {
        it("should return employees by branch with 200 status", async () => {
            // Arrange
            const mockEmployees: Employee[] = [
                {
                    id: "abc123",
                    name: "John Doe",
                    position: "Developer",
                    department: "IT",
                    email: "john@test.com",
                    phone: "204-123-4567",
                    branchId: 1
                }
            ];
            mockReq.params = { branchId: "1" };
            (employeesServices.getEmployeesByBranch as jest.Mock).mockResolvedValue(mockEmployees);

            // Act
            await employeesController.getEmployeeByBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeesServices.getEmployeesByBranch).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: mockEmployees,
                message: "Employees retrieved successfully"
            });
        });

        it("should return 404 when no employees found", async () => {
            // Arrange
            mockReq.params = { branchId: "999" };
            (employeesServices.getEmployeesByBranch as jest.Mock).mockResolvedValue([]);

            // Act
            await employeesController.getEmployeeByBranch(
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
            mockReq.params = { branchId: "1" };
            const mockError: Error = new Error("Database error");
            (employeesServices.getEmployeesByBranch as jest.Mock).mockRejectedValue(mockError);

            // Act
            await employeesController.getEmployeeByBranch(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });

    describe("getEmployeeByDepartment", () => {
        it("should return employees by department with 200 status", async () => {
            // Arrange
            const mockEmployees: Employee[] = [
                {
                    id: "abc123",
                    name: "John Doe",
                    position: "Developer",
                    department: "IT",
                    email: "john@test.com",
                    phone: "204-123-4567",
                    branchId: 1
                }
            ];
            mockReq.params = { department: "IT" };
            (employeesServices.getEmployeesByDepartment as jest.Mock).mockResolvedValue(mockEmployees);

            // Act
            await employeesController.getEmployeeByDepartment(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(employeesServices.getEmployeesByDepartment).toHaveBeenCalledWith("IT");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                status: "success",
                data: mockEmployees,
                message: "Employees retrieved successfully"
            });
        });

        it("should return 404 when no employees found", async () => {
            // Arrange
            mockReq.params = { department: "NonExistent" };
            (employeesServices.getEmployeesByDepartment as jest.Mock).mockResolvedValue([]);

            // Act
            await employeesController.getEmployeeByDepartment(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "Department not found"
            });
        });

        it("should call next with error when service throws", async () => {
            // Arrange
            mockReq.params = { department: "IT" };
            const mockError: Error = new Error("Database error");
            (employeesServices.getEmployeesByDepartment as jest.Mock).mockRejectedValue(mockError);

            // Act
            await employeesController.getEmployeeByDepartment(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockNext).toHaveBeenCalledWith(mockError);
        });
    });
});