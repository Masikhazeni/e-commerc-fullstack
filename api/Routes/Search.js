import  { Router } from "express";
import { search } from "../Controllers/SearchCn.js";

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Search across products, brands, and categories
 */

/**
 * @swagger
 * /api/search:
 *   post:
 *     summary: Search for products, brands, and categories
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of items per page
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 example: "iphone"
 *     responses:
 *       200:
 *         description: Search results returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     brands:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Brand'
 *                     categories:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid request
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         price:
 *           type: number
 *         ...
 *     Brand:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         isActive:
 *           type: boolean
 */


const searchRouter=Router()
searchRouter.route('/').post(search)
export default searchRouter