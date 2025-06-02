import express from 'express';
import { isAdmin } from '../Middlewares/isAdmin.js';
import {
  getAll,
  getFavorites,
  getOne,
  toggleFavoriteProduct,
  update
} from '../Controllers/UserCn.js';
import { isLogin } from '../Middlewares/isLogin.js';


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         fullname:
 *           type: string
 *           description: The full name of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the user
 *         favoriteProduct:
 *           type: array
 *           items:
 *             type: string
 *             description: Array of favorite product IDs
 *         isComplete:
 *           type: boolean
 *           description: Whether user profile is complete
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           default: user
 *           description: User role
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 65d5f8a9b4c7d83b6a3c7f1a
 *         fullname: John Doe
 *         username: johndoe
 *         phoneNumber: +989121234567
 *         favoriteProduct: []
 *         isComplete: true
 *         role: user
 *         createdAt: 2024-02-21T10:30:00.000Z
 *         updatedAt: 2024-02-21T10:30:00.000Z
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
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: List of users
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
 *                   description: Total number of users
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
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
 * /api/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               username:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *               favoriteProduct:
 *                 type: string
 *                 description: Product ID to toggle in favorites
 *     responses:
 *       200:
 *         description: Updated user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
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
 *         description: Forbidden (trying to update another user without admin rights)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/user/favorites:
 *   get:
 *     summary: Get user's favorite products
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       defaultProductVariantId:
 *                         type: string
 *                       imagesUrl:
 *                         type: array
 *                         items:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   post:
 *     summary: Toggle a product in favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 required: true
 *                 description: Product ID to toggle in favorites
 *     responses:
 *       200:
 *         description: Updated favorites list
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
 *                   description: Action performed (added/removed)
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid product ID
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
 */


const userRouter = express.Router();
userRouter
  .route('/favorites')
  .get(isLogin, getFavorites)
  .post(isLogin, toggleFavoriteProduct);

userRouter.route('/')
  .get(isAdmin, getAll);

userRouter.route('/:id')
  .get(isLogin, getOne)
  .patch(isLogin, update);

export default userRouter;




