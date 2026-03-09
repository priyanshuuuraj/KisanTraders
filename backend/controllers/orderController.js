import razorpayInstance from "../config/razorpay.js";
import Cart from "../models/cartModel.js";
import { Order } from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import Product from "../models/productModel.js";
import crypto from "crypto";

// ─── Create Order ────────────────────────────────────────────
export const createOrder = async (req, res) => {
    try {
        const { products, amount, tax, shipping, currency, shippingAddress } = req.body;

        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        const newOrder = new Order({
            user: req.user._id,
            products,
            amount,
            tax,
            shipping,
            currency: currency || "INR",
            shippingAddress,
            status: "Pending",
            razorpayOrderId: razorpayOrder.id,
        });

        await newOrder.save();

        return res.json({ success: true, order: razorpayOrder, dbOrder: newOrder });

    } catch (error) {
        console.error("❌ Error in createOrder:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Verify Payment ──────────────────────────────────────────
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body;
        const userId = req.user._id;

        if (paymentFailed) {
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { returnDocument: "after" }
            );
            return res.status(200).json({ success: false, message: "Payment failed" });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Paid", razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature },
                { returnDocument: "after" }
            );

            await Cart.findOneAndUpdate(
                { userId },
                { $set: { items: [], totalPrice: 0 } },
                { returnDocument: "after" }
            );

            return res.json({ success: true, message: "Payment Successful", order });

        } else {
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { returnDocument: "after" }
            );
            return res.status(200).json({ success: false, message: "Invalid Signature" });
        }

    } catch (error) {
        console.error("❌ Error in verifyPayment:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Get My Orders (logged in user) ──────────────────────────
export const getMyOrder = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate({
                path: "products.productId",
                select: "productName productPrice productImg"
            })
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, count: orders.length, orders });

    } catch (error) {
        console.log("Error fetching user order: ", error);
        return res.status(500).json({ message: error.message });
    }
};

// ─── Get User Orders by userId (Admin) ───────────────────────
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ user: userId })
            .populate({
                path: "products.productId",
                select: "productName productPrice productImg"
            })
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, count: orders.length, orders });

    } catch (error) {
        console.log("Error fetching user order: ", error);
        return res.status(500).json({ message: error.message });
    }
};

// ─── Get All Orders (Admin) ───────────────────────────────────
export const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("user", "firstName lastName email")
            .populate({
                path: "products.productId",
                select: "productName productPrice productImg"
            });

        return res.json({ success: true, count: orders.length, orders });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to fetch all orders", error: error.message });
    }
};

// ─── Update Order Status (Admin) ─────────────────────────────
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { returnDocument: "after" }
        );

        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        return res.json({ success: true, message: "Order status updated", order });

    } catch (error) {
        console.error("❌ Error in updateOrderStatus:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ─── Get Sales Data (Admin Dashboard) ────────────────────────
export const getSalesData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({})
        const totalProducts = await Product.countDocuments({})
        const totalOrders = await Order.countDocuments({ status: "Paid" })

        // Total sales amount
        const totalSaleAgg = await Order.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])
        const totalSales = totalSaleAgg[0]?.total || 0;

        // Sales grouped by date (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const salesByDate = await Order.aggregate([
            { $match: { status: "Paid", createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    amount: { $sum: "$amount" },
                }
            },
            { $sort: { _id: 1 } }
        ])

        const formattedSales = salesByDate.map((item) => ({
            date: item._id,
            amount: item.amount
        }))

        return res.json({
            success: true,
            totalUsers,
            totalProducts,
            totalOrders,
            totalSales,
            sales: formattedSales
        })

    } catch (error) {
        console.error("Error fetching sales data:", error)
        return res.status(500).json({ success: false, message: error.message })
    }
};