import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Package, ChevronRight, Calendar, Hash, ArrowLeft } from "lucide-react";

const statusConfig = {
    Paid:       { bg: "rgba(143,185,122,0.15)", text: "#3d6b40",  dot: "#8fb97a"  },
    Pending:    { bg: "rgba(212,165,116,0.15)", text: "#7a4f2e",  dot: "#d4a574"  },
    Processing: { bg: "rgba(100,160,200,0.15)", text: "#2a5a7a",  dot: "#5a9ec8"  },
    Shipped:    { bg: "rgba(160,120,200,0.15)", text: "#5a3a7a",  dot: "#9a6ac8"  },
    Delivered:  { bg: "rgba(80,180,120,0.15)",  text: "#2a6a4a",  dot: "#50b478"  },
    Failed:     { bg: "rgba(220,80,80,0.12)",   text: "#8a2a2a",  dot: "#dc5050"  },
    Cancelled:  { bg: "rgba(150,140,130,0.12)", text: "#6a6058",  dot: "#9a9088"  },
}

const ShowUserOrders = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/user/${userId}`,
                    { headers: { Authorization: `Bearer ${accessToken}` } });
                if (res.data.success) setOrders(res.data.orders);
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchOrders();
    }, [userId]);

    const handleStatusChange = async (orderId, status) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            await axios.put(`${import.meta.env.VITE_URL}/api/v1/orders/status/${orderId}`, { status },
                { headers: { Authorization: `Bearer ${accessToken}` } });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
        } catch (error) { console.error(error); }
    };

    if (loading) return (
        <div className="md:ml-[260px] min-h-screen flex items-center justify-center gap-2 text-sm"
            style={{ background: "#f5f0e8", color: "#9a8a7a" }}>
            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "#8fb97a", borderTopColor: "transparent" }} />
            Loading orders...
        </div>
    );

    return (
        <div className="md:ml-[260px] min-h-screen py-6 md:py-10 px-4 md:px-8" style={{ background: "#f5f0e8" }}>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5 md:mb-6">
                <button onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all"
                    style={{ borderColor: "rgba(143,185,122,0.3)", color: "#3d6b40", background: "#fff" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: "#2d4a2e" }}>User Orders</h1>
                    <p className="text-xs mt-0.5" style={{ color: "#9a8a7a" }}>
                        {orders.length} order{orders.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="rounded-full p-6 mb-4" style={{ background: "rgba(143,185,122,0.1)" }}>
                        <Package className="w-10 h-10" style={{ color: "#c5d9b8" }} />
                    </div>
                    <p className="font-semibold" style={{ color: "#2d4a2e" }}>No orders found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const st = statusConfig[order.status] || statusConfig.Pending;
                        return (
                            <div key={order._id} className="rounded-2xl overflow-hidden border hover:shadow-md transition-shadow"
                                style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>

                                {/* Order header */}
                                <div className="flex flex-wrap items-center justify-between gap-2 px-4 md:px-5 py-3"
                                    style={{ background: "#faf7f2", borderBottom: "1px solid rgba(143,185,122,0.12)" }}>
                                    <div className="flex flex-wrap items-center gap-2 md:gap-4">
                                        <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "#9a8a7a" }}>
                                            <Hash className="w-3 h-3" />{order._id.slice(-8).toUpperCase()}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "#9a8a7a" }}>
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                                            style={{ background: st.bg, color: st.text }}>
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                                            {order.status}
                                        </span>
                                        <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)}
                                            className="text-xs px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                                            style={{ border: "1px solid rgba(143,185,122,0.3)", background: "#fff", color: "#2d4a2e" }}>
                                            {["Pending","Processing","Shipped","Delivered","Paid","Cancelled","Failed"].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Products */}
                                <div className="px-4 md:px-5 py-4 space-y-3">
                                    {order.products?.map((product, index) => (
                                        <div key={index}
                                            className="flex items-center gap-3 cursor-pointer rounded-xl p-2 -mx-2 transition-all"
                                            onClick={() => navigate(`/products/${product?.productId?._id}`)}
                                            onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.06)"}
                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                            <img src={product?.productId?.productImg?.[0]?.url}
                                                alt={product?.productId?.productName}
                                                className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                                style={{ border: "1px solid rgba(143,185,122,0.2)" }} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium line-clamp-1" style={{ color: "#2d2d2d" }}>
                                                    {product?.productId?.productName}
                                                </p>
                                                <p className="text-xs" style={{ color: "#9a8a7a" }}>Qty: {product?.quantity}</p>
                                            </div>
                                            <p className="text-sm font-bold flex-shrink-0" style={{ color: "#3d6b40" }}>
                                                ₹{(product?.productId?.productPrice * product?.quantity).toLocaleString("en-IN")}
                                            </p>
                                            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "#c5d9b8" }} />
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between px-4 md:px-5 py-3"
                                    style={{ background: "#faf7f2", borderTop: "1px solid rgba(143,185,122,0.12)" }}>
                                    <span />
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs" style={{ color: "#9a8a7a" }}>Total</span>
                                        <span className="text-sm font-bold" style={{ color: "#3d6b40" }}>
                                            ₹{order.amount?.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ShowUserOrders;