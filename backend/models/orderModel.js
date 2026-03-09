import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true }
        }
    ],

    // ✅ Added — sent from AddressForm
    shippingAddress: {
        firstName:  { type: String },
        lastName:   { type: String },
        email:      { type: String },
        phoneNo:    { type: String },
        address:    { type: String },
        landmark:   { type: String },
        city:       { type: String },
        zipCode:    { type: String },
    },

    amount:   { type: Number, required: true },
    tax:      { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },

    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Paid", "Failed"],
        default: "Pending"
    },

    // Razorpay fields
    razorpayOrderId:   { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String }

}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);