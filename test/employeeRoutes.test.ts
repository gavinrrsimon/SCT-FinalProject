import request from "supertest";
import app from "../src/app";
import * as employeesController from "../src/api/v1/controllers/employeesController";
import { HTTP_STATUS } from "../src/constants/httpConstants";

// Mock the service layer
jest.mock("../src/api/v1/controllers/employeesController", () => ({
    getAllEmployees: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getEmployeeById: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    createEmployee: jest.fn((req, res) => res.status(HTTP_STATUS.CREATED).send()),
    updateEmployee: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    deleteEmployee: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getEmployeeByBranch: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getEmployeeByDepartment: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Employee Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/employees", () => {
        it("should return all employees", async () => {
            await request(app).get("/api/v1/employees/");
            expect(employeesController.getAllEmployees).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/employees/:id", () => {
        it("should return employee by id", async () => {
            await request(app).get("/api/v1/employees/abc123");

            expect(employeesController.getEmployeeById).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/employees", () => {
        it("should create a new employee", async () => {
            // Arrange
            const newEmployeeData: {
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
            
            await request(app)
                .post("/api/v1/employees")
                .send(newEmployeeData);

            expect(employeesController.createEmployee).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/employees/:id", () => {
        it("should update an employee", async () => {
            // Arrange
            const updateData: {
                position: string;
                phone: string;
            } = {
                position: "Senior Developer",
                phone: "204-999-9999"
            };
            
            await request(app)
                .put("/api/v1/employees/abc123")
                .send(updateData);

            expect(employeesController.updateEmployee).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/employees/:id", () => {
        it("should delete an employee", async () => {
            await request(app).delete("/api/v1/employees/abc123");
            expect(employeesController.deleteEmployee).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/employees/branch/:branchId", () => {
        it("should return employees by branch", async () => {
            await request(app).get("/api/v1/employees/branch/1");
            expect(employeesController.getEmployeeByBranch).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/employees/department/:department", () => {
        it("should return employees by department", async () => {
            await request(app).get("/api/v1/employees/department/IT");
            expect(employeesController.getEmployeeByDepartment).toHaveBeenCalled();
        });
    });
});