import express from  'express'
import { adminLogin, auth, checkOtp, checkPassword, forgetPassword, resendCode } from '../Controllers/AuthCn.js'

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and Authorization endpoints
 */

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Initiate authentication (check if user exists and send OTP)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "09123456789"
 *     responses:
 *       200:
 *         description: OTP sent or password required
 *       400:
 *         description: Phone number is missing or invalid
 */

/**
 * @swagger
 * /api/auth/otp:
 *   post:
 *     summary: Verify OTP and login/register user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - code
 *               - newAccount
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               code:
 *                 type: string
 *               newAccount:
 *                 type: string
 *                 enum: [true, false]
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       400:
 *         description: Invalid OTP or missing fields
 */

/**
 * @swagger
 * /api/auth/admin:
 *   post:
 *     summary: Admin login with password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - password
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin login successful
 *       400:
 *         description: User not found or password missing
 *       401:
 *         description: Permission denied or wrong credentials
 */

/**
 * @swagger
 * /api/auth/password:
 *   post:
 *     summary: Login with password (for regular users)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - password
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: User not found or invalid password
 */

/**
 * @swagger
 * /api/auth/forget:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - code
 *               - password
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               code:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid OTP, password or missing fields
 */

/**
 * @swagger
 * /api/auth/resend:
 *   post:
 *     summary: Resend OTP code to the user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code sent
 *       400:
 *         description: Missing phone number
 */


const authRouter=express.Router()
authRouter.route('/').post(auth)
authRouter.route('/otp').post(checkOtp)
authRouter.route('/admin').post(adminLogin)
authRouter.route('/password').post(checkPassword)
authRouter.route('/forget').post(forgetPassword)
authRouter.route('/resend').post(resendCode)

export default authRouter