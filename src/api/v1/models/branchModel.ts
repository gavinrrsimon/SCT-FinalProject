/**
 * Represents a Branch in the system
 * @param {string} id - The unique identifier of the branch
 * @param {string} name - The name of the branch
 * @param {string} address - The mailing address of the branch
 * @param {string} phone - The phone number of the branch
 */
export interface Branch {
    id: string;
    name: string;
    address: string;
    phone: string;
}