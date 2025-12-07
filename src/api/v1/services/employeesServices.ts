import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot
} from "firebase-admin/firestore";
import { Employee } from '../models/employeeModel';
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
    getDocumentsByFieldValues,
} from "../repositories/firestoreRepository";

const COLLECTION: string = "employees";

/**
 * Retrieves all employees from Firestore
 * @returns { Promise<Employee[]> } Promise resolving to array of all employee records
 * @example
 * const allEmployees = await getAllEmployees();
 * console.log(`Total employees: ${allEmployees.length}`);
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
    const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
    const employees: Employee[] = snapshot.docs.map((doc) => {
        const data: DocumentData = doc.data();
        return {
            id: doc.id,
            ...data,
        } as Employee;
    });
    return employees;

};

/**
 * Retrieves a specific employee by their unique ID
 * @param {string} id - The unique identifier of the employee
 * @returns { Promise<Employee | undefined> } Promise resolving to the employee object if found, undefined otherwise
 * @example
 * const employee = await getEmployeeById("123abcd");
 * if(employee) {
 *      console.log(`Found: ${employee.name}`);
 * }
 */
export const getEmployeeById = async (
    id: string
): Promise<Employee | undefined> => {
    const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id);

    if (!doc) {
        return undefined;
    }
    
    const data: DocumentData | undefined = doc.data();
    const employee: Employee = {
        id: doc.id,
        ...data,
    } as Employee;

    return structuredClone(employee);

};

/**
 * Creates a new employee record in Firestore
 * @param {Omit<Employee, 'id'>} employeeData - Employee data without ID
 * @param {string} employeeData.name - Full name of the employee
 * @param {string} employeeData.position - Job position/title
 * @param {string} employeeData.department - Name of the department the employee belongs to
 * @param {string} employeeData.email - Employee's email address
 * @param {string} employeeData.phone - Employee's phone number
 * @param {number} employeeData.branchId - ID of the branch employee belongs to
 * @returns { Promise<Employee> } Promise resolving to the newly created employee object with generated ID
 * @example
 * const newEmployee = await createEmployee({
 *      name: "John Doe",
 *      position: "Junior Developer",
 *      department: "IT",
 *      email: "john.doe@pixel-river.com",
 *      phone: "204-123-4567",
 *      branchId: 1
 * });  
 */
export const createEmployee = async (
    employeeData: Omit<Employee, 'id'>
): Promise<Employee> => {
    const newEmployee: Partial<Employee> = {
        ...employeeData,
    };

    const employeeId: string = await createDocument<Employee>(COLLECTION, newEmployee);

    return structuredClone({
        id: employeeId,
        ...newEmployee
    } as Employee);

};

/**
 * Updates an existing employee's information with partial data
 * Only updates the fields provided in updateData, preserves other fields
 * @param {string} id - The unique identifier of the employee to update
 * @param {Partial<Omit<Employee, 'id'>>} updateData - Object containing fields to update
 * @param {string} [updateData.name] - Updated employee name
 * @param {string} [updateData.position] - Updated job position
 * @param {string} [updateData.department] - Updated department
 * @param {string} [updateData.email] - Updated email address
 * @param {string} [updateData.phone] - Updated phone number
 * @param {number} [updateData.branchId] - Updated branch ID
 * @returns { Promise<Employee | null> } Promise resolving to updated employee object if found, null if employee does not exist
 * @example
 * const updateEmployee = await updateEmployee("123abcd", {
 *      position: "Senior Developer",
 *      phone: "204-999-9999"
 * });
 */
export const updateEmployee = async (
    id: string,
    updateData: Partial<Omit<Employee, 'id'>>
): Promise<Employee | null> => {
    const employee: Employee | undefined = await getEmployeeById(id);

    if (!employee) {
        return null;
    }

    const updatedEmployee: Employee = {
        ...employee,
    };

    if (updateData.name !== undefined) updatedEmployee.name = updateData.name;
    if (updateData.position !== undefined) updatedEmployee.position = updateData.position;
    if (updateData.department !== undefined) updatedEmployee.department = updateData.department;
    if (updateData.email !== undefined) updatedEmployee.email = updateData.email;
    if (updateData.phone !== undefined) updatedEmployee.phone = updateData.phone;
    if (updateData.branchId !== undefined) updatedEmployee.branchId = updateData.branchId;

    await updateDocument<Employee>(COLLECTION, id, updatedEmployee);

    return structuredClone(updatedEmployee);        
};

/**
 * Removes an employee from Firestore
 * @param {string} id - The unique identifier of the employee to delete
 * @returns { Promise<boolean> } Promise resolving to true if employee was found and deleted, false if employee doesn't exist
 * @example
 * const wasDeleted: boolean = await deleteEmployee("123abcd");
 * if (wasDeleted) {
 *   console.log('Employee successfully deleted');
 * } else {
 *   console.log('Employee not found');
 * }
 */
export const deleteEmployee = async (id: string): Promise<boolean> => {
    const employee: Employee | undefined = await getEmployeeById(id);

    if (!employee) {
        return false;
    }

    await deleteDocument(COLLECTION, id);
    return true;
};

/**
 * Retrieves all the employees from a specific branch
 * @param branchId - The unique identifier of the branch to lookup employees
 * @returns { Promise<Employee[]> } Array containing all employee records of specified branch.
 * @example
 * const branchEmployeeList: Employee[] = await getEmployeesByBranch(1);
 * if (branchEmployeeList) {
 *      console.log(`Total Branch Employees: ${branchEmployeeList.length}`);
 * } else {
 *      console.log('Branch not found');
 * }
 */
export const getEmployeesByBranch = async (
    branchId: number
): Promise<Employee[]> => {
    const snapshot: QuerySnapshot = await getDocumentsByFieldValues(
        COLLECTION,
        [{
            fieldName: "branchId",
            fieldValue: branchId
        }]
    );
    
    const employees: Employee[] = snapshot.docs.map((doc) => {
        const data: DocumentData = doc.data();
        return {
            id: doc.id,
            ...data,
        } as Employee;
    });

    return employees;
};

/**
 * Retrieves all the employees from a specific department
 * @param department - The department to retrieve employee information from
 * @returns { Promise<Employee[]> } Array containing all employee records of specified department
 * @example
 * const customerServiceEmployeeList: Employee[] = await getEmployeesByDepartment("Customer Service");
 * 
 * if (customerServiceEmployeeList) {
 *      console.log(`Total Customer Service Employees: ${customerServiceEmployeeList.length}`);
 * } else {
 *      console.log('Department not found');
 * }
 */
export const getEmployeesByDepartment = async (
    department: string
): Promise<Employee[]> => {
    const snapshot: QuerySnapshot = await getDocumentsByFieldValues(
        COLLECTION,
        [{
            fieldName: "department", fieldValue: department
        }]
    );
    
    const employees: Employee[] = snapshot.docs.map((doc) => {
        const data: DocumentData = doc.data();
        return {
            id: doc.id,
            ...data,
        } as Employee;
    });

    return employees;
};