import express from "express";
import upload from '../Utils/uploadFile.js';
import { deleteFile, uploadCn } from "../Controllers/UploadCn.js";
/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload and removal API
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a single file
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 file:
 *                   type: object
 *                   description: Uploaded file metadata
 *       400:
 *         description: Upload failed or file not provided
 */

/**
 * @swagger
 * /api/upload:
 *   delete:
 *     summary: Delete a file by fileName
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *             properties:
 *               fileName:
 *                 type: string
 *                 example: "http://localhost:3000/Public/sample.jpg"
 *     responses:
 *       200:
 *         description: File removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: File removed
 *       400:
 *         description: File not found or invalid fileName
 */



const uploadRouter = express.Router();
uploadRouter
  .route("/")
  .post(upload.single("file"), uploadCn)
  .delete( deleteFile);

export default uploadRouter;
