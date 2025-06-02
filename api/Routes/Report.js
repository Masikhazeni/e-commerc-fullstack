import express from 'express';
import * as reportCn from '../Controllers/ReportCn.js';
import { isAdmin } from '../Middlewares/isAdmin.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     ReportResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           default: true
 *         data:
 *           type: object
 *           description: The report data
 * 
 *     DateRangeQuery:
 *       type: object
 *       properties:
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date for filtering (YYYY-MM-DD)
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date for filtering (YYYY-MM-DD)
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
 *   - name: Reports
 *     description: Analytics and reporting endpoints
 *   - name: User Reports
 *     description: User-related analytics
 *   - name: Product Reports
 *     description: Product and inventory analytics
 *   - name: Sales Reports
 *     description: Sales and order analytics
 *   - name: Cart Reports
 *     description: Shopping cart analytics
 *   - name: Interaction Reports
 *     description: Customer interaction analytics
 *   - name: Marketing Reports
 *     description: Marketing and promotions analytics
 *   - name: Logistics Reports
 *     description: Shipping and geography analytics
 *   - name: System Reports
 *     description: System health and growth analytics
 */

/**
 * @swagger
 * /api/report/users/total:
 *   get:
 *     summary: Get total number of users
 *     tags: [User Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total user count
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *               example:
 *                 success: true
 *                 data:
 *                   total: 150
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/report/users/new-vs-active:
 *   get:
 *     summary: Compare new vs active users
 *     tags: [User Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/startDate'
 *       - $ref: '#/components/parameters/endDate'
 *     responses:
 *       200:
 *         description: New vs active users comparison
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *               example:
 *                 success: true
 *                 data:
 *                   newUsers: 25
 *                   activeUsers: 18
 */

/**
 * @swagger
 * /api/report/products/inventory:
 *   get:
 *     summary: Get inventory levels
 *     tags: [Product Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Low stock threshold
 *     responses:
 *       200:
 *         description: Low stock inventory items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *               example:
 *                 success: true
 *                 data:
 *                   - _id: "507f1f77bcf86cd799439011"
 *                     quantity: 5
 */

/**
 * @swagger
 * /api/report/products/sales-by-category:
 *   get:
 *     summary: Get sales by category
 *     tags: [Product Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/startDate'
 *       - $ref: '#/components/parameters/endDate'
 *     responses:
 *       200:
 *         description: Sales breakdown by category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *               example:
 *                 success: true
 *                 data:
 *                   - category: "Electronics"
 *                     totalRevenue: 1500.50
 *                     totalQuantity: 25
 */

/**
 * @swagger
 * /api/report/orders/status-counts:
 *   get:
 *     summary: Get order status counts
 *     tags: [Sales Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/startDate'
 *       - $ref: '#/components/parameters/endDate'
 *     responses:
 *       200:
 *         description: Count of orders by status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *               example:
 *                 success: true
 *                 data:
 *                   - _id: "completed"
 *                     count: 12
 *                   - _id: "pending"
 *                     count: 3
 */

/**
 * @swagger
 * /api/report/orders/revenue-summary:
 *   get:
 *     summary: Get revenue summary
 *     tags: [Sales Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/startDate'
 *       - $ref: '#/components/parameters/endDate'
 *     responses:
 *       200:
 *         description: Gross and net revenue summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *               example:
 *                 success: true
 *                 data:
 *                   gross: 2500.75
 *                   net: 2250.50
 */

/**
 * @swagger
 * /api/report/carts/abandoned-rate:
 *   get:
 *     summary: Get abandoned cart rate
 *     tags: [Cart Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Abandoned cart statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *               example:
 *                 success: true
 *                 data:
 *                   totalCarts: 50
 *                   abandonedCount: 15
 *                   rate: 30
 */

/**
 * @swagger
 * /api/report/interactions/comments-stats:
 *   get:
 *     summary: Get comment statistics
 *     tags: [Interaction Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comment statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *               example:
 *                 success: true
 *                 data:
 *                   total: 45
 *                   approved: 32
 */

/**
 * @swagger
 * /api/report/interactions/ratings-stats:
 *   get:
 *     summary: Get rating statistics
 *     tags: [Interaction Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rating statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *               example:
 *                 success: true
 *                 data:
 *                   avgRate: 4.2
 *                   totalCount: 120
 */

/**
 * @swagger
 * /api/report/marketing/discount-performance:
 *   get:
 *     summary: Get discount code performance
 *     tags: [Marketing Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Discount code usage statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *               example:
 *                 success: true
 *                 data:
 *                   - code: "SUMMER20"
 *                     uses: 15
 *                     isActive: true
 */

/**
 * @swagger
 * /api/report/logistics/shipping-by-region:
 *   get:
 *     summary: Get shipping by region
 *     tags: [Logistics Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shipping distribution by region
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *               example:
 *                 success: true
 *                 data:
 *                   - province: "Tehran"
 *                     city: "Tehran"
 *                     count: 25
 */

/**
 * @swagger
 * /api/report/system/data-growth:
 *   get:
 *     summary: Get system data growth
 *     tags: [System Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System data growth statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportResponse'
 *               example:
 *                 success: true
 *                 data:
 *                   users: 150
 *                   orders: 75
 *                   variants: 320
 *                   categories: 15
 *                   brands: 25
 *                   carts: 50
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     startDate:
 *       in: query
 *       name: startDate
 *       schema:
 *         type: string
 *         format: date
 *       description: Start date for report filtering (YYYY-MM-DD)
 *     endDate:
 *       in: query
 *       name: endDate
 *       schema:
 *         type: string
 *         format: date
 *       description: End date for report filtering (YYYY-MM-DD)
 */

const reportRouter = express.Router();

// 1. User Reports
reportRouter.get('/users/total', isAdmin, reportCn.getTotalUsers);
reportRouter.get('/users/new-vs-active', isAdmin, reportCn.getNewVsActiveUsers);

// 2. Product & Catalog
reportRouter.get('/products/inventory', isAdmin, reportCn.getInventoryLevels);
reportRouter.get('/products/sales-by-category', isAdmin, reportCn.getSalesByCategory);

// 3. Sales & Orders
reportRouter.get('/orders/status-counts', isAdmin, reportCn.getOrderStatusCounts);
reportRouter.get('/orders/revenue-summary', isAdmin, reportCn.getRevenueSummary);

// 4. Cart & Checkout
reportRouter.get('/carts/abandoned-rate', isAdmin, reportCn.getAbandonedCartRate);

// 5. Customer Interaction
reportRouter.get('/interactions/comments-stats', isAdmin, reportCn.getCommentsStats);
reportRouter.get('/interactions/ratings-stats', isAdmin, reportCn.getRatingsStats);

// 6. Marketing & Promotions
reportRouter.get('/marketing/discount-performance', isAdmin, reportCn.getDiscountPerformance);

// 7. Logistics & Geography
reportRouter.get('/logistics/shipping-by-region', isAdmin, reportCn.getShippingByRegion);

// 8. System Health
reportRouter.get('/system/data-growth', isAdmin, reportCn.getDataGrowth);

export default reportRouter;
