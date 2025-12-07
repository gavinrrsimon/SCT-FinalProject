import express, { Router } from 'express';
import * as employeesController from '../controllers/employeesController';
import { validateRequest } from "../middleware/validate";
import { employeeSchemas } from '../validation/employeeSchemas';

const router: Router = express.Router();

// GET /api/v1/employees - Get all employees
router.get(
    '/employees',
    validateRequest(employeeSchemas.list),
    employeesController.getAllEmployees
);

// POST /api/v1/employees - Create new employee
router.post(
    '/employees',
    validateRequest(employeeSchemas.create),
    employeesController.createEmployee
);


// GET /api/v1/employees/branch/:branchId - Get all employees from specified branch
router.get(
    '/employees/branch/:branchId',
    validateRequest(employeeSchemas.getByBranch),
    employeesController.getEmployeeByBranch
);

// GET /api/v1/employees/department/:department - Get all employees from specified department
router.get(
    '/employees/department/:department',
    validateRequest(employeeSchemas.getByDepartment),
    employeesController.getEmployeeByDepartment
);

// GET /api/v1/employees/:id - Get employee by ID
router.get(
    '/employees/:id',
    validateRequest(employeeSchemas.getById),
    employeesController.getEmployeeById
);

// PUT /api/v1/employees/:id - Update employee
router.put(
    '/employees/:id',
    validateRequest(employeeSchemas.update),
    employeesController.updateEmployee
);

// DELETE /api/v1/employees/:id - Delete employee
router.delete(
    '/employees/:id',
    validateRequest(employeeSchemas.delete),
    employeesController.deleteEmployee
);

export default router;