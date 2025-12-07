/**
 * Represents an Employee in the system
 * @param {string} id - The unique identifier of the employee 
 * @param {string} name - Full name of the employee
 * @param {string} position - Job position/title
 * @param {string} department - Name of the department the employee belongs to
 * @param {string} email - Employee's email address
 * @param {string} phone - Employee's phone number
 * @param {number} branchId - ID of the branch the employee belongs to
 */
export interface Employee {
    id: string;
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    branchId: number;
}