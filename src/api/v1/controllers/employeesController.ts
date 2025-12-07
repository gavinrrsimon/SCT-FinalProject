import { Request, Response, NextFunction } from "express";
import * as employeesServices from '../services/employeesServices';
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Employee } from "../models/employeeModel";
import { successResponse } from "../models/responseModel";

/**
 * Retrieves all employees from the system
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response with all employees or error message
 */
export const getAllEmployees = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const employees: Employee[] = await employeesServices.getAllEmployees();
        res.status(HTTP_STATUS.OK).json(
            successResponse(employees, "Employees retrieved successfully")
        );
    } catch (error: unknown) {
        console.error("Error retrieving employees:", error);
        next(error);
    }
};

/**
 * Retrieves a specific employee by their ID
 * @param req - Express request object containing Employee ID in params
 * @param res - Express response object
 * @returns JSON response with employee data or error
 * @throws BAD_REQUEST(400) - When employee ID is invalid or not a number
 * @throws NOT_FOUND(404) - When employee with specified ID is not found
 */
export const getEmployeeById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        const employee: Employee | undefined = await employeesServices.getEmployeeById(id);

        if (!employee) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                error: "Employee not found"
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse(employee, "Employee retrieved successfully")
        );
    } catch (error: unknown) {
        console.error("Error retrieving employee:", error);
        next(error)
    }
};

/**
 * Creates a new employee in the system
 * @param req - Express request object containing employee data in body
 * @param res - Express response object
 * @returns JSON response with created employee data or error message
 * @throws BAD_REQUEST(400) - When required fields are missing from request body
 * @requires req.body.name - Employee's full name
 * @requires req.body.position - Employee's job position
 * @requires req.body.department - Employee's department
 * @requires req.body.email - Employee's email address
 * @requires req.body.phone - Employee's phone number
 * @requires req.body.branchId - ID of the branch employee belongs to 
 */
export const createEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract new employee data
        const { name, position, department, email, phone, branchId }: {
            name: string;
            position: string;
            department: string;
            email: string;
            phone: string;
            branchId: number
        } = req.body;

        const newEmployee: Employee = await employeesServices.createEmployee({
            name,
            position,
            department,
            email,
            phone,
            branchId
        });

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newEmployee, "Employee created successfully")
        );
    } catch (error: unknown) {
        console.error("Error creating employee:", error);
        next(error);
    }
};

/**
 * Updates an existing employee's information
 * @param req - Express request object containing employee ID in params and update in body
 * @param res - Express response object
 * @returns JSON response with updated employee data or error message
 * @throws BAD_REQUEST (400) - When employee ID is invalid or no update fields provided
 * @throws NOT_FOUND (404) - When employee with specified ID is not found
 * @optional req.body.name - Updated employee name
 * @optional req.body.position - Updated employee position
 * @optional req.body.department - Updated employee department
 * @optional req.body.email - Updated employee email address
 * @optional req.body.phone - Updated employee phone number
 * @optional req.body.branchId - Updated employee branch ID
 */
export const updateEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        const { name, position, department, email, phone, branchId }: {
            name: string;
            position: string;
            department: string;
            email: string;
            phone: string;
            branchId: number
        } = req.body;

        const updatedData: Partial<Omit<Employee, 'id'>> = {};
        if (name) updatedData.name = name;
        if (position) updatedData.position = position;
        if (department) updatedData.department = department;
        if (email) updatedData.email = email;
        if (phone) updatedData.phone = phone;
        if (branchId) updatedData.branchId = branchId;

        const updatedEmployee: Employee | null = await employeesServices.updateEmployee(id, updatedData)

        if (!updatedEmployee) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                error: "Employee not found"
            });
            return;
        }
        res.status(HTTP_STATUS.OK).json(
           successResponse(updatedEmployee, "Employee updated successfully")
        );
    } catch (error: unknown) {
        console.error("Error updating employee:", error);
        next(error);
    }
};

/**
 * Deletes an employee from the system
 * @param req - Express request object containing employee ID in params
 * @param res - Express response object
 * @returns JSON response confirming delete or error message
 * @throws BAD_REQUEST(400) - When employee ID is invalid or not a number
 * @throws NOT_FOUND(404) - When employee with specified ID is not found
 */
export const deleteEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        const isDeleted: boolean = await employeesServices.deleteEmployee(id);

        if (!isDeleted) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                error: "Employee not found"
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse({}, "Employee deleted successfully")
        );
    } catch (error: unknown) {
        console.error("Failed to delete employee:", error);
        next(error);
    }
};

/**
 * Retrieves all employees from specified branch
 * @param req - Express request object containing branch ID
 * @param res - Express response object
 * @returns JSON response containing all employees of specified branch or error message
 * @throws BAD_REQUEST(400) - When branchId is invalid or not a number
 * @throws NOT_FOUND(404) - When branch with specified ID is not found
 */
export const getEmployeeByBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const branchId: number = parseInt(req.params.branchId)
    
        const employees: Employee[] = await employeesServices.getEmployeesByBranch(branchId);
    
        if (employees.length === 0) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                error: "Branch not found"
            });
            return;
        }
    
        res.status(HTTP_STATUS.OK).json(
            successResponse(employees, "Employees retrieved successfully")
        );
    } catch (error: unknown) {
        console.error("Failed to fetch employees:", error);
        next(error);
    }
};

export const getEmployeeByDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const department: string = req.params.department

        const employees: Employee[] = await employeesServices.getEmployeesByDepartment(department);

        if (employees.length === 0) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                error: "Department not found"
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse(employees, "Employees retrieved successfully")
        );
    } catch (error: unknown) {
        console.error("Failed to fetch employees:", error);
        next(error);
    }
};