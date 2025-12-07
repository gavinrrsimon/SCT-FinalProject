import { Request, Response, NextFunction } from "express";
import * as branchesServices from '../services/branchesServices';
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Branch } from "../models/branchModel"
import { successResponse } from "../models/responseModel";

/**
 * Retrieves all branches from the system
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response with all branches or error message
 */
export const getAllBranches = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const branches: Branch[] = await branchesServices.getAllBranches();

        res.status(HTTP_STATUS.OK).json(
            successResponse(branches, "Branches retrieved successfully")
        );
    } catch (error: unknown) {
        console.error("Failed to fetch branches:", error);
        next(error);
    }
};

/**
 * Retrieves a specific branch by its ID
 * @param req - Express request object containing branch ID
 * @param res - Express response object
 * @returns JSON response with branch data or error message
 * @throws BAD_REQUEST (400) - When branch ID is invalid or not a number
 * @throws NOT_FOUND (404) - When branch with specified ID is not found
 */
export const getBranchById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        const branch: Branch | undefined = await branchesServices.getBranchById(id);

        if (!branch) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                error: "Branch not found"
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse(branch, "Branch retrieved successfully")
        );
    } catch (error: unknown) {
        console.error("Failed to fetch branch:", error);
        next(error);
    }
};

/**
 * Creates a new branch in the system
 * @param req - Express request object containing branch data
 * @param res - Express response object
 * @returns JSON response with created branch data or error message
 * @throws BAD_REQUEST (400) - When required fields are missing from request body
 * @requires req.body.name - Name of the branch location
 * @requires req.body.address - Mailing address of the branch
 * @requires req.body.phone - Phone number of the branch
 */
export const createBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, address, phone } = req.body;

        const newBranch: Branch = await branchesServices.createBranch({
            name,
            address,
            phone
        });

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newBranch, "Branch created successfully")
        );
    } catch (error: unknown) {
        console.error("Failed to create branch:", error);
        next(error);
    }
};

/**
 * Updates an existing branch's information
 * @param req - Express request object containing branch ID in params and update data in body
 * @param res - Express response object
 * @returns JSON response with updated branch data or error message
 * @throws BAD_REQUEST (400) - When branch ID is invalid or no update fields provided
 * @throws NOT_FOUND (404) - When branch with specified ID is not found
 * @optional req.body.name - Updated branch name
 * @optional req.body.address - Updated branch address  
 * @optional req.body.phone - Updated branch phone number
 */
export const updateBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        const name: string = req.body.name;
        const address: string = req.body.address;
        const phone: string = req.body.phone;
        
        const updatedData: Partial<Omit<Branch, 'id'>> = {};
        if (name) updatedData.name = name;
        if (address) updatedData.address = address;
        if (phone) updatedData.phone = phone;

        const updatedBranch: Branch | null = await branchesServices.updateBranch(id, updatedData);

        if (!updatedBranch) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                error: "Branch not found"
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedBranch, "Branch updated successfully")
        );
    } catch (error: unknown) {
        console.error("Failed to update branch:", error);
        next(error);
    }
};

/**
 * Deletes a branch from the system
 * @param req - Express request object containing branch ID in params
 * @param res - Express response object
 * @returns JSON response confirming deletion or error message
 * @throws BAD_REQUEST (400) - When branch ID is invalid or not a number
 * @throws NOT_FOUND (404) - When branch with specified ID is not found
 */
export const deleteBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        const isDeleted: boolean = await branchesServices.deleteBranch(id);

        if (!isDeleted) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                error: "Branch not found"
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse({}, "Branch deleted successfully")
        );
    } catch (error: unknown) {
        console.error("Failed to delete branch:", error);
        next(error);
    }
};