import  { Router } from "express";
import { add, clear, getUserCart, remove } from "../Controllers/CartCn.js";

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart operations

 * /api/cart:
 *   post:
 *     summary: Add a product variant to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productVariantId
 *               - productId
 *               - categoryId
 *               - quantity
 *             properties:
 *               productVariantId:
 *                 type: string
 *               productId:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                   example: add to cart successfully

 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Cart'

 *   patch:
 *     summary: Remove one or all quantities of a product variant from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productVariantId
 *             properties:
 *               productVariantId:
 *                 type: string
 *               removeAll:
 *                 type: boolean
 *                 description: If true, remove all quantities of this item
 *     responses:
 *       200:
 *         description: Item removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                   example: item removed successfully

 *   delete:
 *     summary: Clear the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                   example: cart is clear

 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               productId:
 *                 type: string
 *               productVariantId:
 *                 type: string
 *               finalPrice:
 *                 type: number
 *               quantity:
 *                 type: number
 *         totalPrice:
 *           type: number
 *         userId:
 *           type: string

 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */


const cartRouter=Router()
cartRouter.route('/').post(add).get(getUserCart).patch(remove).delete(clear)
export default cartRouter