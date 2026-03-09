import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";
import { ShoppingCart, Minus, Plus, Tag, Layers, Package } from "lucide-react";

const ProductDesc = ({ product }) => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    const addToCart = async (productId) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) { toast.error("Please login to add items to cart"); return; }
        if (loading) return;
        setLoading(true);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/cart/add`,
                { productId, quantity },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            if (res?.data?.success) {
                toast.success("Product added to cart");
                dispatch(setCart(res.data.cart));
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    const handleDecrement = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
    const handleIncrement = () => setQuantity(prev => product?.stock ? Math.min(prev + 1, product.stock) : prev + 1);
    const handleInputChange = (e) => {
        const val = Math.max(1, Number(e.target.value) || 1);
        setQuantity(product?.stock ? Math.min(val, product.stock) : val);
    };

    return (
        <div className="flex flex-col gap-5">

            {/* Category + Brand badges */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: "rgba(143,185,122,0.12)", color: "#3d6b40" }}>
                    <Layers className="w-3 h-3" /> {product.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: "rgba(212,165,116,0.12)", color: "#7a4f2e" }}>
                    <Tag className="w-3 h-3" /> {product.brand}
                </span>
                {product?.stock && (
                    <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
                        style={{ background: "rgba(143,185,122,0.08)", color: "#5a7a5a" }}>
                        <Package className="w-3 h-3" /> {product.stock} in stock
                    </span>
                )}
            </div>

            {/* Title */}
            <h1 className="font-bold text-3xl leading-tight" style={{ color: "#2d2d2d" }}>
                {product.productName}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" style={{ color: "#3d6b40" }}>
                    ₹{product.productPrice?.toLocaleString("en-IN")}
                </span>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: "rgba(143,185,122,0.2)" }} />

            {/* Description */}
            <p className="text-sm leading-relaxed line-clamp-6" style={{ color: "#6b6b6b" }}>
                {product.productDesc}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
                <p className="text-sm font-medium" style={{ color: "#5a5a5a" }}>Quantity</p>
                <div className="flex items-center rounded-xl overflow-hidden border"
                    style={{ borderColor: "rgba(143,185,122,0.3)" }}>
                    <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center transition-all duration-150 disabled:opacity-30"
                        style={{ background: "rgba(143,185,122,0.08)", color: "#3d6b40" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.18)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(143,185,122,0.08)"}
                    >
                        <Minus className="w-3.5 h-3.5" />
                    </button>

                    <input
                        type="number"
                        value={quantity}
                        min={1}
                        max={product?.stock || undefined}
                        onChange={handleInputChange}
                        className="w-12 h-10 text-center text-sm font-bold focus:outline-none border-x"
                        style={{
                            background: "#fff",
                            color: "#2d2d2d",
                            borderColor: "rgba(143,185,122,0.3)",
                        }}
                    />

                    <button
                        onClick={handleIncrement}
                        disabled={product?.stock && quantity >= product.stock}
                        className="w-10 h-10 flex items-center justify-center transition-all duration-150 disabled:opacity-30"
                        style={{ background: "rgba(143,185,122,0.08)", color: "#3d6b40" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.18)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(143,185,122,0.08)"}
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={() => addToCart(product._id)}
                disabled={loading}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-[0.97] disabled:opacity-60 w-fit"
                style={{
                    background: loading ? "#a0c896" : "linear-gradient(135deg, #2d4a2e, #3d6b40)",
                    color: "#fff",
                    boxShadow: "0 2px 14px rgba(61,107,64,0.3)",
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = "0 4px 20px rgba(61,107,64,0.45)" }}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 14px rgba(61,107,64,0.3)"}
            >
                <ShoppingCart className="w-4 h-4" />
                {loading ? "Adding..." : "Add to Cart"}
            </button>

        </div>
    );
};

export default ProductDesc;