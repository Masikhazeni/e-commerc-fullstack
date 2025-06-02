import express from "express";
import { isAdmin } from "../Middlewares/isAdmin.js";
import {
  changeActivity,
  create,
  getAll,
  getOne,
  getProductComments,
  remove,
  replyComment,
} from "../Controllers/CommentCn.js";
import { isLogin } from "../Middlewares/isLogin.js";

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Manage product comments

 * /api/comment:
 *   get:
 *     summary: Get all comments (admin only)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
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
 *         description: Number of comments per page
 *     responses:
 *       200:
 *         description: List of all comments
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
 *                     $ref: '#/components/schemas/Comment'

 *   post:
 *     summary: Create a new comment (logged-in users)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content, productId]
 *             properties:
 *               content:
 *                 type: string
 *               productId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Comment Created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Comment'

 * /api/comment/{id}:
 *   get:
 *     summary: Get a comment by ID (with filters)
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Comment'

 *   patch:
 *     summary: Toggle comment activity (admin only)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity status changed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: change activity successfully

 *   delete:
 *     summary: Delete a comment by ID (admin only)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Comment remove successfully

 * /api/comment/product/{id}:
 *   get:
 *     summary: Get all active comments for a specific product
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of product comments
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
 *                     $ref: '#/components/schemas/Comment'

 * /api/comment/reply/{id}:
 *   patch:
 *     summary: Reply to a comment (admin only)
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reply]
 *             properties:
 *               reply:
 *                 type: string
 *                 example: Thank you for your feedback!
 *     responses:
 *       200:
 *         description: Comment replied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Comment Reply Successfully
 *                 data:
 *                   $ref: '#/components/schemas/Comment'

 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         productId:
 *           type: string
 *           description: ID of the product being commented on
 *         userId:
 *           type: string
 *           description: ID of the user who made the comment
 *         content:
 *           type: string
 *           maxLength: 150
 *           example: Great product! Fast delivery.
 *         isActive:
 *           type: boolean
 *           default: true
 *         reply:
 *           type: string
 *           example: Thank you!
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time

 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */


const commentRouter = express.Router();
commentRouter.route("/").get(isAdmin, getAll).post(isLogin, create);
commentRouter.route("/reply/:id").patch(isAdmin, replyComment);
commentRouter.get("/product/:id", getProductComments);

commentRouter
  .route("/:id")
  .get(getOne)
  .patch(isAdmin, changeActivity)
  .delete(isAdmin, remove);

export default commentRouter;

