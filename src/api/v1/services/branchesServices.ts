import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot
} from "firebase-admin/firestore";
import { Branch } from "../models/branchModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

const COLLECTION: string = "branches";

/**
 * Retrieves all branches from Firestore
 * @returns { Promise<Branch[]> } Promise resolving to array containing all branch records
 * @example
 * const allBranches = await getAllBranches();
 * console.log(`Total branches: ${allBranches.length}`);
 */
export const getAllBranches = async (): Promise<Branch[]> => {
    const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
    const branches: Branch[] = snapshot.docs.map((doc) => {
        const data: DocumentData = doc.data();
        return {
            id: doc.id,
            ...data,
        } as Branch;
    });
    return branches;
};

/**
 * Retrieves a specific branch by its unique ID
 * @param {string} id - The unique identifier of the branch
 * @returns { Promise<Branch | undefined> } Promise resolving to the branch object if found, undefined otherwise
 * @example
 * const branch = await getBranchById("123abcd");
 * if (branch) {
 *      console.log(`Found: ${branch.name}`);
 * } else {
 *      console.log('Branch not found');
 * }
 */
export const getBranchById = async(
    id: string
): Promise<Branch | undefined> => {
    const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id);

    if (!doc) {
        return undefined;
    }
    
    const data: DocumentData | undefined = doc.data();
    const branch: Branch = {
        id: doc.id,
        ...data,
    } as Branch;

    return structuredClone(branch);
};

/**
 * Creates a new branch record and adds it to the data store
 * Automatically generates a unique ID for the new branch
 * @param {Omit<Branch, 'id'>} branchData - Branch data without ID
 * @param {string} branchData.name - Name of the  branch location
 * @param {string} branchData.address - Mailing Address of the branch
 * @param {string} branchData.phone - The phone number of the branch
 * @returns { Promise<Branch> } Promise resolving to the newly created branch object with generated ID
 * @example
 * const newBranch = await createBranch({
 *      name: "The Forks Branch",
 *      address: "123 Forks Rd",
 *      phone: "431-431-4314"
 * });
 */
export const createBranch = async (
    branchData: Omit<Branch, 'id'>
): Promise<Branch> => {
    const newBranch: Partial<Branch> = {
        ...branchData,
    };

    const branchId: string = await createDocument<Branch>(COLLECTION, newBranch);

    return structuredClone({
        id: branchId,
        ...newBranch
    } as Branch);
};

/**
 * Updates an existing branch's information with partial data
 * Only updates the fields provided in updateData, preserves other fields
 * @param {string} id - The unique identifier of the branch to update
 * @param {Partial<Omit<Branch, 'id'>>} updateData - Object containing fields to update
 * @param {string} [updateData.name] - Updated branch name
 * @param {string} [updateData.address] - Updated branch address
 * @param {string} [updateData.phone] - Updated branch phone number
 * @returns { Promise<Branch | null> } Promise resolving to updated branch object if found, null if branch doesn't exist
 * @example
 * const updatedBranch = await updateBranch("123abcd", {
 *      address: "909 New St",
 *      phone: "204-423-1233"
 * });
 * if (updatedBranch) {
 *      console.log(`Updated: ${updatedBranch.name}`);
 * }
 */
export const updateBranch = async (
    id: string,
    updateData: Partial<Omit<Branch, 'id'>>
): Promise<Branch | null> => {
    const branch: Branch | undefined = await getBranchById(id);

    if (!branch) {
        return null;
    }

    const updatedBranch: Branch = {
        ...branch,
    };

    if (updateData.name !== undefined) updatedBranch.name = updateData.name;
    if (updateData.address !== undefined) updatedBranch.address = updateData.address;
    if (updateData.phone !== undefined) updatedBranch.phone = updateData.phone;

    await updateDocument<Branch>(COLLECTION, id, updatedBranch);

    return structuredClone(updatedBranch);        
};

/**
 * Removes a branch from the data store
 * @param {string} id - The unique identifier of the branch to delete
 * @returns  { Promise<boolean> } Promise resolving to true if the branch was found and deleted, false if branch doesn't exist
 * @example
 * const wasDeleted = await deleteBranch("123abcd");
 * if (wasDeleted) {
 *      console.log('Branch successfully deleted');
 * } else {
 *      console.log('Branch not found');
 * }
 */
export const deleteBranch = async (id: string): Promise<boolean> => {
    const branch: Branch | undefined = await getBranchById(id);

    if (!branch) {
        return false;
    }

    await deleteDocument(COLLECTION, id);
    return true;
};