import React, { useEffect, useState } from "react";
import { CheckCircle2, Wrench, ShoppingBag, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setTimeout(() => navigate("/"), 10000);
        const tick = setInterval(() => setCountdown(c => c - 1), 1000);
        return () => { clearTimeout(timer); clearInterval(tick); };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#f5f0e8" }}>
            <div className="w-full max-w-md rounded-2xl border p-8 text-center" style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="p-1.5 rounded-xl" style={{ background: "rgba(143,185,122,0.15)" }}>
                        <Wrench className="w-4 h-4" style={{ color: "#3d6b40" }} />
                    </div>
                    <span className="font-bold text-sm" style={{ color: "#2d4a2e" }}>Kisan Traders</span>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div className="rounded-full p-4" style={{ background: "rgba(143,185,122,0.12)" }}>
                        <CheckCircle2 className="w-14 h-14" style={{ color: "#3d6b40" }} />
                    </div>
                </div>

                <h1 className="text-xl font-bold mb-2" style={{ color: "#2d4a2e" }}>Payment Successful! 🎉</h1>
                <p className="text-sm leading-relaxed" style={{ color: "#9a8a7a" }}>
                    Thank you for your purchase! Your order has been placed and you'll receive a confirmation shortly.
                </p>

                {/* Divider */}
                <div className="h-px my-6" style={{ background: "rgba(143,185,122,0.2)" }} />

                <p className="text-xs mb-6" style={{ color: "#b0a090" }}>
                    Redirecting to home in {countdown} second{countdown !== 1 ? "s" : ""}...
                </p>

                <div className="flex flex-col gap-3">
                    <button onClick={() => navigate("/products")}
                        className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                        style={{ background: "linear-gradient(135deg, #2d4a2e, #3d6b40)", boxShadow: "0 2px 12px rgba(61,107,64,0.3)" }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(61,107,64,0.4)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(61,107,64,0.3)"}>
                        <ShoppingBag className="w-4 h-4" /> Continue Shopping
                    </button>
                    <button onClick={() => navigate(`/orders`)}
                        className="w-full py-3 rounded-xl font-semibold text-sm border transition-all flex items-center justify-center gap-2"
                        style={{ borderColor: "rgba(143,185,122,0.3)", color: "#3d6b40" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <ClipboardList className="w-4 h-4" /> View My Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;