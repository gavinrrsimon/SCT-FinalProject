import Joi from "joi";
import { RequestSchemas } from "../middleware/validate";

export const employeeSchemas: Record<string, RequestSchemas> = {
    // POST /employees - Create new Employee
    create: {
        body: Joi.object({
            name: Joi.string().required().messages(
                {
                "any.required": "Employee name is required",
                "string.empty": "Employee name cannot be empty",
                }
            ),
            position: Joi.string().required().messages(
                {
                "any.required": "Employee position is required",
                "string.empty": "Employee position cannot be empty",
                }
            ),
            department: Joi.string().required().messages(
                {
                "any.required": "Employee department is required",
                "string.empty": "Employee department cannot be empty",
                }
            ),
            email: Joi.string().email().required().messages(
                {
                "any.required": "Employee email is required",
                "string.empty": "Employee email cannot be empty",
                "string.email": "Employee email must be valid",
                }
            ),
            phone: Joi.string().required().messages(
                {
                "any.required": "Employee phone number is required",
                "string.empty": "Employee phone number cannot be empty",
                }
            ),
            branchId: Joi.number().required().messages(
                {
                "any.required": "Employee branch ID required",
                "number.base": "Employee branch ID must be a number",
                }
            ),
        }),
    },

    // GET /employees/:id - Get single employee
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages(
                {
                "any.required": "Employee ID is required",
                "string.empty": "Employee ID cannot be empty",
                }
            ),
        }),
    },

    // PUT /employees/:id - Update employee by id
    update: {
        params: Joi.object({
            id: Joi.string().required().messages(
                {
                "any.required": "Employee ID is required",
                "string.empty": "Employee ID cannot be empty",
                }
            ),
        }),
        body: Joi.object({
            name: Joi.string().optional().messages(
                {
                "string.empty": "Employee name cannot be empty",
                }
            ),
            position: Joi.string().optional().messages(
                {
                "string.empty": "Employee position cannot be empty",
                }
            ),
            department: Joi.string().optional().messages(
                {
                "string.empty": "Employee department cannot be empty",
                }
            ),
            email: Joi.string().email().optional().messages(
                {
                "string.empty": "Employee email cannot be empty",
                "string.email": "Employee email must be valid",
                }
            ),
            phone: Joi.string().optional().messages(
                {
                "string.empty": "Employee phone number cannot be empty",
                }
            ),
            branchId: Joi.number().optional().messages(
                {
                "number.base": "Employee branch ID must be a number",
                }
            ),
        }),
    },

    // DELETE /employees/:id - Delete employee by id
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages(
                {
                "any.required": "Employee ID is required",
                "string.empty": "Employee ID cannot be empty",
                }
            ),
        }),
    },

    // GET /employees - Get all employees
    list: {
        query: Joi.object({}).unknown(true),
    },

    // GET /employees/branch/:branchId - Get employees by branch
    getByBranch: {
        params: Joi.object({
            branchId: Joi.string().required().messages(
                {
                "any.required": "Branch ID is required",
                "string.empty": "Branch ID cannot be empty",
                }
            ),
        }),
    },

    // GET /employees/department/:department - Get employees by department
    getByDepartment: {
        params: Joi.object({
            department: Joi.string().required().messages(
                {
                "any.required": "Department is required",
                "string.empty": "Department cannot be empty",
                }
            ),
        }),
    },
};