import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, Minus, Plus, Tag, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import userLogo from "../assets/def.png";
import { setCart } from "../redux/productSlice";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.product.cart);
    const accessToken = localStorage.getItem("accessToken");

    const subtotal = cart?.totalPrice || 0;
    const shipping = subtotal > 299 ? 0 : 49;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    const loadCart = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/v1/cart`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            if (res.data.success) dispatch(setCart(res.data.cart));
        } catch (error) { console.log(error); }
    };

    const handleUpdate = async (productId, type) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_URL}/api/v1/cart/update`,
                { productId, type },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            if (res.data.success) dispatch(setCart(res.data.cart));
        } catch (error) { toast.error("Failed to update quantity"); }
    };

    const handleRemove = async (productId) => {
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_URL}/api/v1/cart/remove`,
                { data: { productId }, headers: { Authorization: `Bearer ${accessToken}` } }
            );
            if (res.data.success) { dispatch(setCart(res.data.cart)); toast.success("Item removed"); }
        } catch (error) { toast.error("Failed to remove item"); }
    };

    useEffect(() => { loadCart(); }, []);

    if (!cart?.items?.length) return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20" style={{ background: "#f5f0e8" }}>
            <div className="rounded-full p-6 sm:p-8 mb-5" style={{ background: "rgba(143,185,122,0.12)" }}>
                <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: "#c5d9b8" }} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold mb-2" style={{ color: "#2d4a2e" }}>Your cart is empty</h2>
            <p className="text-sm mb-6 text-center" style={{ color: "#9a8a7a" }}>Add some products to get started</p>
            <Link to="/products">
                <button className="px-8 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.97]"
                    style={{ background: "#3d6b40", color: "#fff", boxShadow: "0 2px 12px rgba(61,107,64,0.3)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#2d4a2e"}
                    onMouseLeave={e => e.currentTarget.style.background = "#3d6b40"}>
                    Shop Now
                </button>
            </Link>
        </div>
    );

    return (
        <div className="pt-16 sm:pt-20 min-h-screen pb-10" style={{ background: "#f5f0e8" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                <h1 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-8 flex items-center gap-2" style={{ color: "#2d4a2e" }}>
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#8fb97a" }} />
                    Shopping Cart
                    <span className="text-xs sm:text-sm font-normal px-2.5 py-0.5 rounded-full ml-1"
                        style={{ background: "rgba(143,185,122,0.15)", color: "#3d6b40" }}>
                        {cart.items.length} item{cart.items.length !== 1 ? "s" : ""}
                    </span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">

                    {/* CART ITEMS */}
                    <div className="flex flex-col gap-3 flex-1">
                        {cart.items.map((product, index) => (
                            <div key={index} className="rounded-2xl p-3 sm:p-4 border transition-shadow hover:shadow-md"
                                style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>

                                <div className="flex items-center gap-3 sm:gap-4">

                                    {/* Image */}
                                    <img
                                        src={product?.productId?.productImg?.[0]?.url ?? userLogo}
                                        alt="product"
                                        onClick={() => navigate(`/products/${product?.productId?._id}`)}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl flex-shrink-0 cursor-pointer"
                                        style={{ border: "1px solid rgba(143,185,122,0.2)" }}
                                    />

                                    {/* Name + Price (flex-1) */}
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-semibold text-xs sm:text-sm line-clamp-2 mb-1 leading-snug" style={{ color: "#2d2d2d" }}>
                                            {product?.productId?.productName}
                                        </h2>
                                        <p className="text-sm font-bold" style={{ color: "#3d6b40" }}>
                                            ₹{product?.productId?.productPrice?.toLocaleString("en-IN")}
                                        </p>

                                        {/* On mobile: show line total below price */}
                                        <p className="text-xs mt-0.5 sm:hidden font-semibold" style={{ color: "#2d2d2d" }}>
                                            Total: ₹{((product?.productId?.productPrice || 0) * product?.quantity).toLocaleString("en-IN")}
                                        </p>
                                    </div>

                                    {/* Right side controls */}
                                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 flex-shrink-0">

                                        {/* Quantity stepper */}
                                        <div className="flex items-center rounded-xl overflow-hidden border"
                                            style={{ borderColor: "rgba(143,185,122,0.3)" }}>
                                            <button
                                                onClick={() => handleUpdate(product?.productId?._id, "decrease")}
                                                className="w-8 h-8 flex items-center justify-center transition-all touch-manipulation"
                                                style={{ background: "rgba(143,185,122,0.08)", color: "#3d6b40" }}
                                                onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.2)"}
                                                onMouseLeave={e => e.currentTarget.style.background = "rgba(143,185,122,0.08)"}
                                            ><Minus className="w-3 h-3" /></button>
                                            <span className="w-8 text-center text-sm font-bold" style={{ color: "#2d2d2d" }}>
                                                {product?.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdate(product?.productId?._id, "increase")}
                                                className="w-8 h-8 flex items-center justify-center transition-all touch-manipulation"
                                                style={{ background: "rgba(143,185,122,0.08)", color: "#3d6b40" }}
                                                onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.2)"}
                                                onMouseLeave={e => e.currentTarget.style.background = "rgba(143,185,122,0.08)"}
                                            ><Plus className="w-3 h-3" /></button>
                                        </div>

                                        {/* Line total — desktop only */}
                                        <div className="w-20 text-right font-bold text-sm hidden sm:block" style={{ color: "#2d2d2d" }}>
                                            ₹{((product?.productId?.productPrice || 0) * product?.quantity).toLocaleString("en-IN")}
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => handleRemove(product?.productId?._id)}
                                            className="flex items-center gap-1 text-xs px-2 sm:px-2.5 py-1.5 rounded-lg transition-all touch-manipulation"
                                            style={{ color: "#c05050", background: "rgba(200,80,80,0.07)" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "rgba(200,80,80,0.15)"}
                                            onMouseLeave={e => e.currentTarget.style.background = "rgba(200,80,80,0.07)"}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ORDER SUMMARY */}
                    <div className="w-full lg:w-[360px] h-fit rounded-2xl border p-4 sm:p-6 space-y-4"
                        style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>

                        <h2 className="font-bold text-base" style={{ color: "#2d4a2e" }}>Order Summary</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between" style={{ color: "#6b6b6b" }}>
                                <span>Subtotal ({cart.items.length} items)</span>
                                <span style={{ color: "#2d2d2d", fontWeight: 600 }}>₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between" style={{ color: "#6b6b6b" }}>
                                <span>Shipping</span>
                                <span style={{ color: shipping === 0 ? "#3d6b40" : "#2d2d2d", fontWeight: 600 }}>
                                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                                </span>
                            </div>
                            <div className="flex justify-between" style={{ color: "#6b6b6b" }}>
                                <span>Tax (18%)</span>
                                <span style={{ color: "#2d2d2d", fontWeight: 600 }}>₹{tax.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="h-px" style={{ background: "rgba(143,185,122,0.2)" }} />

                        <div className="flex justify-between font-bold text-base" style={{ color: "#2d4a2e" }}>
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>

                        {/* Promo */}
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#9a8a7a" }} />
                                <input placeholder="Promo code"
                                    className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm border focus:outline-none"
                                    style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2d2d2d" }} />
                            </div>
                            <button className="px-3 sm:px-4 py-2.5 rounded-xl text-sm font-medium border transition-all flex-shrink-0"
                                style={{ borderColor: "rgba(143,185,122,0.4)", color: "#3d6b40" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.1)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                Apply
                            </button>
                        </div>

                        {/* Checkout */}
                        <button
                            onClick={() => navigate('/address')}
                            className="w-full py-3 sm:py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.97] touch-manipulation"
                            style={{ background: "linear-gradient(135deg, #2d4a2e, #3d6b40)", color: "#fff", boxShadow: "0 2px 14px rgba(61,107,64,0.3)" }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(61,107,64,0.45)"}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 14px rgba(61,107,64,0.3)"}
                        >
                            Proceed to Checkout →
                        </button>

                        <Link to="/products">
                            <button className="w-full py-2.5 sm:py-3 rounded-xl font-medium text-sm border transition-all mt-1 touch-manipulation"
                                style={{ borderColor: "rgba(0,0,0,0.1)", color: "#6b6b6b" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.03)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                Continue Shopping
                            </button>
                        </Link>

                        {/* Trust notes */}
                        <div className="pt-1 space-y-1.5">
                            {[
                                { icon: <Truck className="w-3 h-3" />, text: "Free shipping on orders over ₹299" },
                                { icon: <RotateCcw className="w-3 h-3" />, text: "30-day return policy" },
                                { icon: <ShieldCheck className="w-3 h-3" />, text: "Secure SSL checkout" },
                            ].map(item => (
                                <div key={item.text} className="flex items-center gap-2 text-xs" style={{ color: "#9a8a7a" }}>
                                    <span style={{ color: "#8fb97a" }}>{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;