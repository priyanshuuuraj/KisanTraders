import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";
import { ShoppingCart, Minus, Plus, Tag, Layers, Package, Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";

const ProductDesc = ({ product }) => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [wished, setWished] = useState(false);
    const [activeImg, setActiveImg] = useState(0);

    const images = product?.productImg || [];

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

    const prevImg = () => setActiveImg(i => (i - 1 + images.length) % images.length);
    const nextImg = () => setActiveImg(i => (i + 1) % images.length);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

            {/* LEFT — Image gallery */}
            <div className="flex flex-col gap-3">
                {/* Main image */}
                <div className="relative rounded-2xl overflow-hidden aspect-square"
                    style={{ background: "#f5f0e8", border: "1px solid rgba(143,185,122,0.2)" }}>
                    <img
                        src={images[activeImg]?.url}
                        alt={product.productName}
                        className="w-full h-full object-cover transition-all duration-300"
                    />
                    {images.length > 1 && (
                        <>
                            <button onClick={prevImg}
                                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full shadow transition-all"
                                style={{ background: "rgba(255,255,255,0.9)" }}>
                                <ChevronLeft className="w-4 h-4" style={{ color: "#2d4a2e" }} />
                            </button>
                            <button onClick={nextImg}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full shadow transition-all"
                                style={{ background: "rgba(255,255,255,0.9)" }}>
                                <ChevronRight className="w-4 h-4" style={{ color: "#2d4a2e" }} />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {images.map((img, i) => (
                            <button key={i} onClick={() => setActiveImg(i)}
                                className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all"
                                style={{
                                    border: activeImg === i ? "2px solid #3d6b40" : "2px solid transparent",
                                    opacity: activeImg === i ? 1 : 0.6,
                                }}>
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT — Details */}
            <div className="flex flex-col gap-4">

                {/* Badges */}
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

                {/* Title + actions row */}
                <div className="flex items-start justify-between gap-3">
                    <h1 className="font-bold text-2xl sm:text-3xl leading-tight flex-1" style={{ color: "#2d2d2d" }}>
                        {product.productName}
                    </h1>
                    <div className="flex gap-2 flex-shrink-0 mt-1">
                        <button onClick={() => setWished(w => !w)}
                            className="p-2 rounded-xl transition-all"
                            style={{ background: wished ? "rgba(220,80,80,0.08)" : "rgba(0,0,0,0.04)" }}>
                            <Heart className="w-4 h-4"
                                style={{ color: wished ? "#dc5050" : "#aaa", fill: wished ? "#dc5050" : "none" }} />
                        </button>
                        <button onClick={() => { navigator.share?.({ title: product.productName, url: window.location.href }); }}
                            className="p-2 rounded-xl transition-all"
                            style={{ background: "rgba(0,0,0,0.04)" }}>
                            <Share2 className="w-4 h-4" style={{ color: "#aaa" }} />
                        </button>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold" style={{ color: "#3d6b40" }}>
                        ₹{product.productPrice?.toLocaleString("en-IN")}
                    </span>
                </div>

                <div className="h-px" style={{ background: "rgba(143,185,122,0.2)" }} />

                {/* Description */}
                <p className="text-sm leading-relaxed" style={{ color: "#6b6b6b" }}>
                    {product.productDesc}
                </p>

                <div className="h-px" style={{ background: "rgba(143,185,122,0.2)" }} />

                {/* Quantity + Cart row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Quantity */}
                    <div className="flex items-center rounded-xl overflow-hidden border"
                        style={{ borderColor: "rgba(143,185,122,0.3)" }}>
                        <button onClick={handleDecrement} disabled={quantity <= 1}
                            className="w-11 h-11 flex items-center justify-center transition-all disabled:opacity-30 touch-manipulation"
                            style={{ background: "rgba(143,185,122,0.08)", color: "#3d6b40" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.18)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(143,185,122,0.08)"}>
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-12 h-11 flex items-center justify-center text-sm font-bold border-x"
                            style={{ background: "#fff", color: "#2d2d2d", borderColor: "rgba(143,185,122,0.3)" }}>
                            {quantity}
                        </span>
                        <button onClick={handleIncrement}
                            disabled={product?.stock && quantity >= product.stock}
                            className="w-11 h-11 flex items-center justify-center transition-all disabled:opacity-30 touch-manipulation"
                            style={{ background: "rgba(143,185,122,0.08)", color: "#3d6b40" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.18)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(143,185,122,0.08)"}>
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={() => addToCart(product._id)}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-[0.97] disabled:opacity-60 touch-manipulation"
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
            </div>
        </div>
    );
};

export default ProductDesc;