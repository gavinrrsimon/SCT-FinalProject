import Joi from "joi";
import { RequestSchemas } from "../middleware/validate";

export const branchSchemas: Record<string, RequestSchemas> = {
    // POST /branches - Create new branch
    create: {
        body: Joi.object({
            name: Joi.string().required().messages(
                {
                "any.required": "Branch name is required",
                "string.empty": "Branch name cannot be empty",
                }
            ),
            address: Joi.string().required().messages(
                {
                "any.required": "Branch address is required",
                "string.empty": "Branch address cannot be empty",
                }
            ),
            phone: Joi.string().required().messages(
                {
                "any.required": "Branch phone number is required",
                "string.empty": "Branch phone number cannot be empty",
                }
            ),
        }),
    },

    // GET /branches/:id - Get single branch
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages(
                {
                "any.required": "Branch ID is required",
                "string.empty": "Branch ID cannot be empty",
                }
            ),
        }),
    },

    // PUT /branches/:id - Update branch by id
    update: {
        params: Joi.object({
            id: Joi.string().required().messages(
                {
                "any.required": "Branch ID is required",
                "string.empty": "Branch ID cannot be empty",
                }
            ),
        }),
        body: Joi.object({
            name: Joi.string().optional().messages(
                {
                "string.empty": "Branch name cannot be empty",
                }
            ),
            address: Joi.string().optional().messages(
                {
                "string.empty": "Branch address cannot be empty",
                }
            ),
            phone: Joi.string().optional().messages(
                {
                "string.empty": "Branch phone number cannot be empty",
                }
            ),
        }),
    },

    // DELETE /branches/:id - Delete branch by id
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages(
                {
                "any.required": "Branch ID is required",
                "string.empty": "Branch ID cannot be empty",
                }
            ),
        }),
    },

    // GET /branches - Get all branches
    list: {
        query: Joi.object({}).unknown(true),
    },
};