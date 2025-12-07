import * as employeesServices from "../src/api/v1/services/employeesServices";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Employee } from "../src/api/v1/models/employeeModel";

// Mock the repository module
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Employees Services", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllEmployees", () => {
        it("should return all employees", async () => {
            // Arrange
            const mockSnapshot: {
                docs: {
                    id: string;
                    data: () => ({
                        name: string;
                        position: string;
                        department: string;
                        email: string;
                        phone: string;
                        branchId: number;
                    })
                }[]
            } = {
                docs: [
                    {
                        id: "abc123",
                        data: () => ({
                            name: "John Doe",
                            position: "Developer",
                            department: "IT",
                            email: "john@test.com",
                            phone: "204-123-4567",
                            branchId: 1
                        })
                    },
                    {
                        id: "def456",
                        data: () => ({
                            name: "Jane Smith",
                            position: "Manager",
                            department: "HR",
                            email: "jane@test.com",
                            phone: "204-765-4321",
                            branchId: 2
                        })
                    }
                ]
            };
            (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

            // Act
            const result: Employee[] = await employeesServices.getAllEmployees();

            // Assert
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("employees");
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe("abc123");
            expect(result[0].name).toBe("John Doe");
        });

        it("should return empty array when no employees exist", async () => {
            // Arrange
            const mockSnapshot: { docs: never[] } = { docs: [] };
            (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

            // Act
            const result: Employee[] = await employeesServices.getAllEmployees();

            // Assert
            expect(result).toEqual([]);
        });

        it("should throw error when repository fails", async () => {
            // Arrange
            (firestoreRepository.getDocuments as jest.Mock).mockRejectedValue(
                new Error("Firestore error")
            );

            // Act & Assert
            await expect(employeesServices.getAllEmployees()).rejects.toThrow("Firestore error");
        });
    });

    describe("getEmployeeById", () => {
        it("should return employee when found", async () => {
            // Arrange
            const mockDoc: {
                id: string;
                data: () => ({
                    name: string;
                    position: string;
                    department: string;
                    email: string;
                    phone: string;
                    branchId: number;
                })
            } = {
                id: "abc123",
                data: () => ({
                    name: "John Doe",
                    position: "Developer",
                    department: "IT",
                    email: "john@test.com",
                    phone: "204-123-4567",
                    branchId: 1
                })
            };
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            // Act
            const result: Employee | undefined = await employeesServices.getEmployeeById("abc123");

            // Assert
            expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("employees", "abc123");
            expect(result).toBeDefined();
            expect(result?.id).toBe("abc123");
            expect(result?.name).toBe("John Doe");
        });

        it("should return undefined when employee not found", async () => {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(null);

            // Act
            const result: Employee | undefined = await employeesServices.getEmployeeById("xyz999");

            // Assert
            expect(result).toBeUndefined();
        });

        it("should throw error when repository fails", async () => {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock).mockRejectedValue(
                new Error("Firestore error")
            );

            // Act & Assert
            await expect(employeesServices.getEmployeeById("abc123")).rejects.toThrow("Firestore error");
        });
    });

    describe("createEmployee", () => {
        it("should create employee successfully", async () => {
            // Arrange
            const employeeData: {
                name: string,
                position: string,
                department: string,
                email: string,
                phone: string,
                branchId: number
            } = {
                name: "John Doe",
                position: "Developer",
                department: "IT",
                email: "john@test.com",
                phone: "204-123-4567",
                branchId: 1
            };

            const mockDocumentId: string = "test-item-id";

            (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(mockDocumentId);

            // Act
            const result: Employee = await employeesServices.createEmployee(employeeData);

            // Assert
            expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
                "employees",
                expect.objectContaining({
                    name: employeeData.name,
                    position: employeeData.position,
                    department: employeeData.department,
                    email: employeeData.email,
                    phone: employeeData.phone,
                    branchId: employeeData.branchId
                })
            );
            expect(result.id).toBe(mockDocumentId);
            expect(result.name).toBe(employeeData.name);
        });

        it("should throw error when repository fails", async () => {
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

            const mockError: Error = new Error("Firestore error");

            (firestoreRepository.createDocument as jest.Mock).mockRejectedValue(mockError);

            // Act & Assert
            await expect(employeesServices.createEmployee(employeeData)).rejects.toThrow(
                "Firestore error"
            );
        });
    });

    describe("updateEmployee", () => {
        it("should update and return employee", async () => {
            // Arrange
            const mockDoc: {
                id: string,
                data: () => ({
                    name: string;
                    position: string;
                    department: string;
                    email: string;
                    phone: string;
                    branchId: number;
                });
            } = {
                id: "abc123",
                data: () => ({
                    name: "John Doe",
                    position: "Developer",
                    department: "IT",
                    email: "john@test.com",
                    phone: "204-123-4567",
                    branchId: 1
                })
            };
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);
            (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(undefined);

            const updateData: { position: string } = { position: "Senior Developer" };

            // Act
            const result: Employee | null = await employeesServices.updateEmployee("abc123", updateData);

            // Assert
            expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("employees", "abc123");
            expect(firestoreRepository.updateDocument).toHaveBeenCalled();
            expect(result?.position).toBe("Senior Developer");
            expect(result?.name).toBe("John Doe"); // Other fields unchanged
        });

        it("should return null when employee not found", async () => {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(null);

            // Act
            const result: Employee | null = await employeesServices.updateEmployee("xyz999", { position: "Manager" });

            // Assert
            expect(result).toBeNull();
            expect(firestoreRepository.updateDocument).not.toHaveBeenCalled();
        });

        it("should throw error when repository fails", async () => {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock).mockRejectedValue(
                new Error("Firestore error")
            );

            // Act & Assert
            await expect(
                employeesServices.updateEmployee("abc123", { position: "Manager" })
            ).rejects.toThrow("Firestore error");
        });
    });

    describe("deleteEmployee", () => {
        it("should delete employee and return true", async () => {
            // Arrange
            const mockDoc: {
                id: string;
                data: () => ({
                    name: string;
                    position: string;
                    department: string;
                    email: string;
                    phone: string;
                    branchId: number;
                })
            } = {
                id: "abc123",
                data: () => ({
                    name: "John Doe",
                    position: "Developer",
                    department: "IT",
                    email: "john@test.com",
                    phone: "204-123-4567",
                    branchId: 1
                })
            };
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);
            (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(undefined);

            // Act
            const result: boolean = await employeesServices.deleteEmployee("abc123");

            // Assert
            expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("employees", "abc123");
            expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("employees", "abc123");
            expect(result).toBe(true);
        });

        it("should return false when employee not found", async () => {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(null);

            // Act
            const result: boolean = await employeesServices.deleteEmployee("xyz999");

            // Assert
            expect(result).toBe(false);
            expect(firestoreRepository.deleteDocument).not.toHaveBeenCalled();
        });

        it("should throw error when repository fails", async () => {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock).mockRejectedValue(
                new Error("Firestore error")
            );

            // Act & Assert
            await expect(employeesServices.deleteEmployee("abc123")).rejects.toThrow("Firestore error");
        });
    });

    describe("getEmployeesByBranch", () => {
        it("should return employees for specified branch", async () => {
            // Arrange
            const mockSnapshot: {
                docs: {
                    id: string;
                    data: () => ({
                        name: string;
                        position: string;
                        department: string;
                        email: string;
                        phone: string;
                        branchId: number;
                    })
                }[]
            } = {
                docs: [
                    {
                        id: "abc123",
                        data: () => ({
                            name: "John Doe",
                            position: "Developer",
                            department: "IT",
                            email: "john@test.com",
                            phone: "204-123-4567",
                            branchId: 1
                        })
                    }
                ]
            };
            (firestoreRepository.getDocumentsByFieldValues as jest.Mock).mockResolvedValue(mockSnapshot);

            // Act
            const result: Employee[] = await employeesServices.getEmployeesByBranch(1);

            // Assert
            expect(firestoreRepository.getDocumentsByFieldValues).toHaveBeenCalledWith(
                "employees",
                [{ fieldName: "branchId", fieldValue: 1 }]
            );
            expect(result).toHaveLength(1);
            expect(result[0].branchId).toBe(1);
        });

        it("should return empty array when no employees in branch", async () => {
            // Arrange
            const mockSnapshot: { docs: never[] } = { docs: [] };
            (firestoreRepository.getDocumentsByFieldValues as jest.Mock).mockResolvedValue(mockSnapshot);

            // Act
            const result: Employee[] = await employeesServices.getEmployeesByBranch(999);

            // Assert
            expect(result).toEqual([]);
        });

        it("should throw error when repository fails", async () => {
            // Arrange
            (firestoreRepository.getDocumentsByFieldValues as jest.Mock).mockRejectedValue(
                new Error("Firestore error")
            );

            // Act & Assert
            await expect(employeesServices.getEmployeesByBranch(1)).rejects.toThrow("Firestore error");
        });
    });

    describe("getEmployeesByDepartment", () => {
        it("should return employees for specified department", async () => {
            // Arrange
            const mockSnapshot: {
                docs: {
                    id: string;
                    data: () => ({
                        name: string;
                        position: string;
                        department: string;
                        email: string;
                        phone: string;
                        branchId: number;
                    })
                }[]
            } = {
                docs: [
                    {
                        id: "abc123",
                        data: () => ({
                            name: "John Doe",
                            position: "Developer",
                            department: "IT",
                            email: "john@test.com",
                            phone: "204-123-4567",
                            branchId: 1
                        })
                    }
                ]
            };
            (firestoreRepository.getDocumentsByFieldValues as jest.Mock).mockResolvedValue(mockSnapshot);

            // Act
            const result: Employee[] = await employeesServices.getEmployeesByDepartment("IT");

            // Assert
            expect(firestoreRepository.getDocumentsByFieldValues).toHaveBeenCalledWith(
                "employees",
                [{ fieldName: "department", fieldValue: "IT" }]
            );
            expect(result).toHaveLength(1);
            expect(result[0].department).toBe("IT");
        });

        it("should return empty array when no employees in department", async () => {
            // Arrange
            const mockSnapshot: { docs: never[] } = { docs: [] };
            (firestoreRepository.getDocumentsByFieldValues as jest.Mock).mockResolvedValue(mockSnapshot);

            // Act
            const result: Employee[] = await employeesServices.getEmployeesByDepartment("NonExistent");

            // Assert
            expect(result).toEqual([]);
        });

        it("should throw error when repository fails", async () => {
            // Arrange
            (firestoreRepository.getDocumentsByFieldValues as jest.Mock).mockRejectedValue(
                new Error("Firestore error")
            );

            // Act & Assert
            await expect(employeesServices.getEmployeesByDepartment("IT")).rejects.toThrow("Firestore error");
        });
    });
});