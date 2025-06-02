import express from "express";
import { isAdmin } from "../Middlewares/isAdmin.js";
import {
  create,
  getAll,
  getOne,
  remove,
  check,
  update,
} from "../Controllers/DiscountCodeCn.js";
import { isLogin } from "../Middlewares/isLogin.js";

/**
 * @swagger
 * tags:
 *   name: Discount
 *   description: Discount code management

 * /api/discount:
 *   get:
 *     summary: Get all discount codes (admin only)
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All discounts retrieved
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
 *                     $ref: '#/components/schemas/Discount'

 *   post:
 *     summary: Create a new discount code (admin only)
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Discount'
 *     responses:
 *       201:
 *         description: Discount created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Discount'
 *                 message:
 *                   type: string
 *                   example: discount create successfully

 * /api/discount/check:
 *   post:
 *     summary: Check discount code validity (user only)
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - totalPrice
 *             properties:
 *               code:
 *                 type: string
 *               totalPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Discount is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     discountPercent:
 *                       type: number
 *       400:
 *         description: Invalid or expired code

 * /api/discount/{id}:
 *   get:
 *     summary: Get discount by ID (admin only)
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discount retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Discount'

 *   patch:
 *     summary: Update discount by ID (admin only)
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Discount'
 *     responses:
 *       200:
 *         description: Discount updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Discount'
 *                 message:
 *                   type: string

 *   delete:
 *     summary: Delete discount by ID (admin only)
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discount removed successfully
 *       400:
 *         description: Cannot delete discount that has been used

 * components:
 *   schemas:
 *     Discount:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           example: SAVE10
 *         userIdsUsed:
 *           type: array
 *           items:
 *             type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         expireTime:
 *           type: string
 *           format: date-time
 *         percent:
 *           type: number
 *           minimum: 1
 *           maximum: 100
 *         maxUsedCount:
 *           type: number
 *           example: 1
 *         maxPrice:
 *           type: number
 *           example: 500
 *         minPrice:
 *           type: number
 *           example: 100
 *         isActive:
 *           type: boolean
 *           example: true

 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */


const discountRouter = express.Router();
discountRouter.route("/").get(isAdmin, getAll).post(isAdmin, create);
discountRouter.route("/check").post(isLogin, check);
discountRouter
  .route("/:id")
  .get(isAdmin, getOne)
  .patch(isAdmin, update)
  .delete(isAdmin, remove);
export default discountRouter;
