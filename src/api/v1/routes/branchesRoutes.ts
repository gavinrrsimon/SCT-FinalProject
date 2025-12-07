import express, { Router } from 'express';
import * as branchesController from '../controllers/branchesController';
import { validateRequest } from '../middleware/validate';
import { branchSchemas } from '../validation/branchSchemas';

const router: Router = express.Router();

// GET /api/v1/branches - Get all branches
router.get(
    '/branches',
    validateRequest(branchSchemas.list),
    branchesController.getAllBranches
); 

// POST /api/v1/branches - Create new branch
router.post(
    '/branches',
    validateRequest(branchSchemas.create),
    branchesController.createBranch
);


// GET /api/v1/branches/:id - Get branch by id
router.get(
    '/branches/:id',
    validateRequest(branchSchemas.getById),
    branchesController.getBranchById
);

// PUT /api/v1/branches/:id - Update branch
router.put(
    '/branches/:id',
    validateRequest(branchSchemas.update),
    branchesController.updateBranch
);

// DELETE /api/v1/branches/:id - Delete branch
router.delete(
    '/branches/:id',
    validateRequest(branchSchemas.delete),
    branchesController.deleteBranch
);

export default router;