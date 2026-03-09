import express from "express"
import { isAuthenticated, isAdmin } from "../middleware/isAuthenticated.js"
import {
    createOrder,
    verifyPayment,
    getMyOrder,
    getSalesData,
    getUserOrders,
    getAllOrdersAdmin,
    updateOrderStatus
} from "../controllers/orderController.js"

const router = express.Router()

// User routes
router.post("/create-order", isAuthenticated, createOrder)
router.post("/verify-payment", isAuthenticated, verifyPayment)
router.get("/myorder", isAuthenticated, getMyOrder)

// Admin routes
router.get("/user/:userId", isAuthenticated, isAdmin, getUserOrders)
router.get("/all", isAuthenticated, isAdmin, getAllOrdersAdmin)
router.put("/status/:orderId", isAuthenticated, isAdmin, updateOrderStatus)
router.get("/sales", isAuthenticated, isAdmin, getSalesData)


export default router