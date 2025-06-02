import express from "express";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "../Controllers/ProductVariantCn.js";
import { isAdmin } from "../Middlewares/isAdmin.js";

/**
 * @swagger
 * tags:
 *   name: ProductVariant
 *   description: Manage product variants

 * /api/product-variant:
 *   get:
 *     summary: Get all product variants
 *     tags: [ProductVariant]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of product variants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductVariant'

 *   post:
 *     summary: Create a new product variant
 *     tags: [ProductVariant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVariant'
 *     responses:
 *       201:
 *         description: Product variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'
 *                 message:
 *                   type: string
 *                   example: Brand create successfully

 * /api/product-variant/{id}:
 *   get:
 *     summary: Get a product variant by ID
 *     tags: [ProductVariant]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product variant
 *     responses:
 *       200:
 *         description: Product variant details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'

 *   patch:
 *     summary: Update a product variant
 *     tags: [ProductVariant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product variant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVariant'
 *     responses:
 *       200:
 *         description: Product variant updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'

 *   delete:
 *     summary: Delete a product variant
 *     tags: [ProductVariant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product variant
 *     responses:
 *       200:
 *         description: Product variant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: productVariant deleted successfully

 * components:
 *   schemas:
 *     ProductVariant:
 *       type: object
 *       required:
 *         - price
 *         - quantity
 *         - variantId
 *         - productId
 *       properties:
 *         price:
 *           type: number
 *           example: 1500000
 *         discount:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           default: 0
 *           example: 10
 *         quantity:
 *           type: number
 *           example: 20
 *         variantId:
 *           type: string
 *           example: 60f7e85fc6f9b400153b2ef9
 *         productId:
 *           type: string
 *           example: 60f7e85fc6f9b400153b2efa
 *         priceAfterDiscount:
 *           type: number
 *           example: 1350000

 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */


const productVariantRouter = express.Router();
productVariantRouter.route("/").get(getAll).post(isAdmin, create);
productVariantRouter
  .route("/:id")
  .get(getOne)
  .patch(isAdmin, update)
  .delete(isAdmin, remove);
export default productVariantRouter;
