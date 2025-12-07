import * as branchesServices from "../src/api/v1/services/branchesServices";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Branch } from "../src/api/v1/models/branchModel";

// Mock the repository module
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Branches Services", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllBranches", () => {
        it("should return all branches", async () => {
            // Arrange
            const mockSnapshot: {
                docs: {
                    id: string;
                    data: () => {
                        name: string;
                        address: string;
                        phone: string;
                    };
                }[];
            } = {
                docs: [
                    {
                        id: "abc123",
                        data: () => ({
                            name: "Downtown Branch",
                            address: "123 Main St",
                            phone: "204-555-5555"
                        })
                    },
                    {
                        id: "def456",
                        data: () => ({
                            name: "South Branch",
                            address: "456 Oak Ave",
                            phone: "204-555-6666"
                        })
                    }
                ]
            };
            (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

            // Act
            const result: Branch[] = await branchesServices.getAllBranches();

            // Assert
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("branches");
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe("abc123");
            expect(result[0].name).toBe("Downtown Branch");
        });

        it("should return empty array when no branches exist", async () => {
            // Arrange
            const mockSnapshot: { docs: never[] } = { docs: [] };
            (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

            // Act
            const result: Branch[] = await branchesServices.getAllBranches();

            // Assert
            expect(result).toEqual([]);
        });

        it("should throw error when repository fails", async () => {
            // Arrange
            (firestoreRepository.getDocuments as jest.Mock).mockRejectedValue(
                new Error("Firestore error")
            );

            // Act & Assert
            await expect(branchesServices.getAllBranches()).rejects.toThrow("Firestore error");
        });
    });

    describe("getBranchById", () => {
        it("should return branch when found", async () => {
            // Arrange
            const mockDoc: { 
                id: string;
                data: () => ({
                    name: string;
                    address: string;
                    phone: string;
                })
            } = {
                id: "abc123",
                data: () => ({
                    name: "Downtown Branch",
                    address: "123 Main St",
                    phone: "204-555-5555"
                })
            };
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            // Act
            const result: Branch | undefined = await branchesServices.getBranchById("abc123");

            // Assert
            expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("branches", "abc123");
            expect(result).toBeDefined();
            expect(result?.id).toBe("abc123");
            expect(result?.name).toBe("Downtown Branch");
        });

        it("should return undefined when branch not found", async () => {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(null);

            // Act
            const result: Branch | undefined = await branchesServices.getBranchById("xyz999");

            // Assert
            expect(result).toBeUndefined();
        });

        it("should throw error when repository fails", async () => {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock).mockRejectedValue(
                new Error("Firestore error")
            );

            // Act & Assert
            await expect(branchesServices.getBranchById("abc123")).rejects.toThrow("Firestore error");
        });
    });

    describe("createBranch", () => {
        it("should create and return new branch", async () => {
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
            (firestoreRepository.createDocument as jest.Mock).mockResolvedValue("abc123");

            // Act
            const result: Branch = await branchesServices.createBranch(branchData);

            // Assert
            expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
                "branches",
                branchData
            );
            expect(result.id).toBe("abc123");
            expect(result.name).toBe("Downtown Branch");
        });

        it("should throw error when repository fails", async () => {
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
            (firestoreRepository.createDocument as jest.Mock).mockRejectedValue(
                new Error("Firestore error")
            );

            // Act & Assert
            await expect(branchesServices.createBranch(branchData)).rejects.toThrow(
                "Firestore error"
            );
        });
    });

    describe("updateBranch", () => {
        it("should update and return branch", async () => {
            // Arrange
            const mockDoc: {
                id: string;
                data: () => ({
                    name: string;
                    address: string;
                    phone: string;
                })
            } = {
                id: "abc123",
                data: () => ({
                    name: "Downtown Branch",
                    address: "123 Main St",
                    phone: "204-555-5555"
                })
            };
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);
            (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(undefined);

            const updateData: { address: string } = { address: "999 New St" };

            // Act
            const result: Branch | null = await branchesServices.updateBranch("abc123", updateData);

            // Assert
            expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("branches", "abc123");
            expect(firestoreRepository.updateDocument).toHaveBeenCalled();
            expect(result?.address).toBe("999 New St");
            expect(result?.name).toBe("Downtown Branch"); // Other fields unchanged
        });

        it("should return null when branch not found", async () => {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(null);

            // Act
            const result: Branch | null = await branchesServices.updateBranch("xyz999", { address: "999 New St" });

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
                branchesServices.updateBranch("abc123", { address: "999 New St" })
            ).rejects.toThrow("Firestore error");
        });
    });

    describe("deleteBranch", () => {
        it("should delete branch and return true", async () => {
            // Arrange
            const mockDoc: {
                id: string;
                data: () => ({
                    name: string;
                    address: string;
                    phone: string;
                });
            } = {
                id: "abc123",
                data: () => ({
                    name: "Downtown Branch",
                    address: "123 Main St",
                    phone: "204-555-5555"
                })
            };
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);
            (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(undefined);

            // Act
            const result: boolean = await branchesServices.deleteBranch("abc123");

            // Assert
            expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("branches", "abc123");
            expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("branches", "abc123");
            expect(result).toBe(true);
        });

        it("should return false when branch not found", async () => {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(null);

            // Act
            const result: boolean = await branchesServices.deleteBranch("xyz999");

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
            await expect(branchesServices.deleteBranch("abc123")).rejects.toThrow("Firestore error");
        });
    });
});