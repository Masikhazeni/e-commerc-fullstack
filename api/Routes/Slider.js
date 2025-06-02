import express from  'express'
import { create, getAll, getOne, remove, update, } from '../Controllers/SliderCn.js'
import { isAdmin } from '../Middlewares/isAdmin.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Slider:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the slider
 *         title:
 *           type: string
 *           description: The title of the slider
 *         image:
 *           type: string
 *           description: Path to the slider image
 *         href:
 *           type: string
 *           description: URL link for the slider
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 65d5f8a9b4c7d83b6a3c7f1c
 *         title: Summer Sale
 *         image: uploads/sliders/summer-sale.jpg
 *         href: /products/summer-collection
 *         createdAt: 2024-02-21T10:30:00.000Z
 *         updatedAt: 2024-02-21T10:30:00.000Z
 * 
 *     SliderCreate:
 *       type: object
 *       required:
 *         - title
 *         - image
 *         - href
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the slider
 *         image:
 *           type: string
 *           description: Path to the slider image
 *         href:
 *           type: string
 *           description: URL link for the slider
 *       example:
 *         title: Winter Collection
 *         image: uploads/sliders/winter-collection.jpg
 *         href: /products/winter-collection
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
 *   name: Sliders
 *   description: Slider management endpoints
 */

/**
 * @swagger
 * /api/slider:
 *   get:
 *     summary: Get all sliders
 *     tags: [Sliders]
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
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by slider title
 *     responses:
 *       200:
 *         description: List of sliders
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
 *                   description: Total number of sliders
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Slider'
 * 
 *   post:
 *     summary: Create a new slider (Admin only)
 *     tags: [Sliders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SliderCreate'
 *     responses:
 *       201:
 *         description: Slider created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 data:
 *                   $ref: '#/components/schemas/Slider'
 *                 message:
 *                   type: string
 *                   example: Slider create successfully
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
 * /api/slider/{id}:
 *   get:
 *     summary: Get a slider by ID (Admin only)
 *     tags: [Sliders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Slider ID
 *     responses:
 *       200:
 *         description: Slider data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 data:
 *                   $ref: '#/components/schemas/Slider'
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
 *         description: Slider not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     summary: Update a slider (Admin only)
 *     tags: [Sliders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Slider ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SliderCreate'
 *     responses:
 *       200:
 *         description: Updated slider data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 data:
 *                   $ref: '#/components/schemas/Slider'
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
 *         description: Slider not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     summary: Delete a slider (Admin only)
 *     tags: [Sliders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Slider ID
 *     responses:
 *       200:
 *         description: Slider deleted successfully
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
 *                   example: slider deleted successfully
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
 *         description: Slider not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const sliderRouter=express.Router()
 sliderRouter.route('/').get(getAll).post(isAdmin,create)
 sliderRouter.route('/:id').get(isAdmin,getOne).delete(isAdmin,remove).patch(isAdmin,update)
export default sliderRouter