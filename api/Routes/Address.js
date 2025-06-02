import express from  'express'
import { create, getAll, getOne, remove, update } from '../Controllers/AddressCn.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the address
 *         city:
 *           type: string
 *           description: City of the address
 *         userId:
 *           type: string
 *           description: ID of the user who owns this address
 *         receiverName:
 *           type: string
 *           description: Name of the receiver
 *         receiverPhoneNumber:
 *           type: string
 *           description: Phone number of the receiver (Iranian format)
 *         postalCode:
 *           type: string
 *           description: Postal code
 *         street:
 *           type: string
 *           description: Street name
 *         plaque:
 *           type: string
 *           description: Plaque number
 *         province:
 *           type: string
 *           description: Province
 *         description:
 *           type: string
 *           description: Additional address description
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 65d5f8a9b4c7d83b6a3c7f1f
 *         city: "Tehran"
 *         userId: "65d5f8a9b4c7d83b6a3c7f1a"
 *         receiverName: "Ali Mohammadi"
 *         receiverPhoneNumber: "09123456789"
 *         postalCode: "1234567890"
 *         street: "Valiasr"
 *         plaque: "12"
 *         province: "Tehran"
 *         description: "Next to the park"
 *         createdAt: 2024-02-21T10:30:00.000Z
 *         updatedAt: 2024-02-21T10:30:00.000Z
 * 
 *     AddressCreate:
 *       type: object
 *       required:
 *         - city
 *         - receiverName
 *         - receiverPhoneNumber
 *         - postalCode
 *         - street
 *         - plaque
 *         - province
 *       properties:
 *         city:
 *           type: string
 *         receiverName:
 *           type: string
 *         receiverPhoneNumber:
 *           type: string
 *         postalCode:
 *           type: string
 *         street:
 *           type: string
 *         plaque:
 *           type: string
 *         province:
 *           type: string
 *         description:
 *           type: string
 *         userId:
 *           type: string
 *           description: Only admin can set this field
 *       example:
 *         city: "Tehran"
 *         receiverName: "Ali Mohammadi"
 *         receiverPhoneNumber: "09123456789"
 *         postalCode: "1234567890"
 *         street: "Valiasr"
 *         plaque: "12"
 *         province: "Tehran"
 *         description: "Next to the park"
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
 *   name: Addresses
 *   description: Address management endpoints
 */

/**
 * @swagger
 * /api/address:
 *   get:
 *     summary: Get all addresses (user gets only their addresses, admin gets all)
 *     tags: [Addresses]
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
 *         description: List of addresses
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
 *                   description: Total number of addresses
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   post:
 *     summary: Create a new address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressCreate'
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *                 message:
 *                   type: string
 *                   example: address create successfully
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
 */

/**
 * @swagger
 * /api/address/{id}:
 *   get:
 *     summary: Get an address by ID (user can only access their own addresses)
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized (trying to access another user's address)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     summary: Update an address (user can only update their own addresses)
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressCreate'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *                 message:
 *                   type: string
 *                   example: address update successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (trying to update another user's address)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   delete:
 *     summary: Delete an address (user can only delete their own addresses)
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
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
 *                   example: address remove successfully
 *       401:
 *         description: Unauthorized (trying to delete another user's address)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const addressRouter=express.Router()
 addressRouter.route('/').get(getAll).post(create)
 addressRouter.route('/:id').get(getOne).patch(update).delete(remove)
export default addressRouter