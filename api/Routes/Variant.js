import express from "express";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "../Controllers/VariantCn.js";
import { isAdmin } from "../Middlewares/isAdmin.js";
/**
 * @swagger
 * components:
 *   schemas:
 *     Variant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the variant
 *         type:
 *           type: string
 *           enum: [size, color]
 *           description: Type of variant (size or color)
 *         value:
 *           type: string
 *           description: The value of the variant (e.g., "XL", "Red")
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 65d5f8a9b4c7d83b6a3c7f1b
 *         type: size
 *         value: XL
 *         createdAt: 2024-02-21T10:30:00.000Z
 *         updatedAt: 2024-02-21T10:30:00.000Z
 * 
 *     VariantCreate:
 *       type: object
 *       required:
 *         - type
 *         - value
 *       properties:
 *         type:
 *           type: string
 *           enum: [size, color]
 *           description: Type of variant (size or color)
 *         value:
 *           type: string
 *           description: The value of the variant
 *       example:
 *         type: color
 *         value: Blue
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           default: false
 *         message:
 *           type: string
 *           description: Error message
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Variants
 *   description: Product variant management endpoints
 */

/**
 * @swagger
 * /api/variant:
 *   get:
 *     summary: Get all variants
 *     tags: [Variants]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by field (prefix with - for descending)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to include
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: Comma-separated relations to populate
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [size, color]
 *         description: Filter by variant type
 *     responses:
 *       200:
 *         description: List of variants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 count:
 *                   type: integer
 *                   description: Total number of variants
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Variant'
 * 
 *   post:
 *     summary: Create a new variant (Admin only)
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VariantCreate'
 *     responses:
 *       201:
 *         description: Variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 data:
 *                   $ref: '#/components/schemas/Variant'
 *                 message:
 *                   type: string
 *                   example: Variant create successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (not admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/variant/{id}:
 *   get:
 *     summary: Get a variant by ID
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 data:
 *                   $ref: '#/components/schemas/Variant'
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     summary: Update a variant (Admin only)
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VariantCreate'
 *     responses:
 *       200:
 *         description: Updated variant data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 data:
 *                   $ref: '#/components/schemas/Variant'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (not admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     summary: Delete a variant (Admin only)
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 message:
 *                   type: string
 *                   example: variant deleted successfully
 *       400:
 *         description: Cannot delete variant (used in products)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 message:
 *                   type: string
 *                   example: you can't delete this variant, please first delete all Product of this variants
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (not admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Variant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const variantRouter = express.Router();
variantRouter.route("/").get(getAll).post(isAdmin, create);
variantRouter
  .route("/:id")
  .get(getOne)
  .patch(isAdmin, update)
  .delete(isAdmin, remove);
export default variantRouter;
