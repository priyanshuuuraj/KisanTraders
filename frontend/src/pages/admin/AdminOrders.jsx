import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Hash, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const statusConfig = {
    Paid:       { bg: "rgba(143,185,122,0.15)", text: "#3d6b40",  dot: "#8fb97a"  },
    Pending:    { bg: "rgba(212,165,116,0.15)", text: "#7a4f2e",  dot: "#d4a574"  },
    Processing: { bg: "rgba(100,160,200,0.15)", text: "#2a5a7a",  dot: "#5a9ec8"  },
    Shipped:    { bg: "rgba(160,120,200,0.15)", text: "#5a3a7a",  dot: "#9a6ac8"  },
    Delivered:  { bg: "rgba(80,180,120,0.15)",  text: "#2a6a4a",  dot: "#50b478"  },
    Failed:     { bg: "rgba(220,80,80,0.12)",   text: "#8a2a2a",  dot: "#dc5050"  },
    Cancelled:  { bg: "rgba(150,140,130,0.12)", text: "#6a6058",  dot: "#9a9088"  },
}

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/all`,
                    { headers: { Authorization: `Bearer ${accessToken}` } });
                if (data.success) setOrders(data.orders);
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            await axios.put(`${import.meta.env.VITE_URL}/api/v1/orders/status/${orderId}`, { status },
                { headers: { Authorization: `Bearer ${accessToken}` } });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
        } catch (error) { console.error(error); }
    };

    if (loading) return (
        <div className="md:pl-[260px] py-20 flex items-center justify-center gap-2 text-sm" style={{ color: "#9a8a7a" }}>
            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#8fb97a", borderTopColor: "transparent" }} />
            Loading orders...
        </div>
    );

    return (
        <div className="md:pl-[260px] min-h-screen pt-20 md:pt-20 md:pt-10 pb-10 px-4 md:px-6" style={{ background: "#f5f0e8" }}>

            {/* Back button */}
            <button onClick={() => navigate(-1)}
                className="flex md:hidden items-center gap-2 mb-4 px-3 py-2 rounded-xl text-sm border transition-all"
                style={{ borderColor: "rgba(143,185,122,0.3)", color: "#3d6b40", background: "#fff" }}>
                <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <div className="mb-5 md:mb-6">
                <h1 className="text-xl font-bold" style={{ color: "#2d4a2e" }}>All Orders</h1>
                <p className="text-xs mt-0.5" style={{ color: "#9a8a7a" }}>{orders.length} orders total</p>
            </div>

            {orders.length === 0 ? (
                <p style={{ color: "#9a8a7a" }}>No orders found.</p>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block rounded-2xl border overflow-hidden" style={{ borderColor: "rgba(143,185,122,0.2)" }}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm" style={{ background: "#fff" }}>
                                <thead>
                                    <tr style={{ background: "#faf7f2", borderBottom: "1px solid rgba(143,185,122,0.15)" }}>
                                        {["Order ID","User","Products","Amount","Status","Update","Date"].map(h => (
                                            <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a6a5a" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => {
                                        const st = statusConfig[order.status] || statusConfig.Pending;
                                        return (
                                            <tr key={order._id} className="border-b transition-colors"
                                                style={{ borderColor: "rgba(143,185,122,0.1)" }}
                                                onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.04)"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                                <td className="px-4 py-3 font-mono text-xs" style={{ color: "#9a8a7a" }}>#{order._id.slice(-8).toUpperCase()}</td>
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-sm" style={{ color: "#2d2d2d" }}>{order.user?.firstName} {order.user?.lastName}</p>
                                                    <p className="text-xs" style={{ color: "#9a8a7a" }}>{order.user?.email}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {order.products?.map((p, idx) => (
                                                        <p key={idx} className="text-xs" style={{ color: "#6b6b6b" }}>{p.productId?.productName} × {p.quantity}</p>
                                                    ))}
                                                </td>
                                                <td className="px-4 py-3 font-bold text-sm" style={{ color: "#3d6b40" }}>₹{order.amount?.toLocaleString("en-IN")}</td>
                                                <td className="px-4 py-3">
                                                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                                                        style={{ background: st.bg, color: st.text }}>
                                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)}
                                                        className="text-xs px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                                                        style={{ border: "1px solid rgba(143,185,122,0.3)", background: "#faf7f2", color: "#2d4a2e" }}>
                                                        {["Pending","Processing","Shipped","Delivered","Paid","Cancelled","Failed"].map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 text-xs" style={{ color: "#9a8a7a" }}>
                                                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile cards */}
                    <div className="flex md:hidden flex-col gap-4">
                        {orders.map((order) => {
                            const st = statusConfig[order.status] || statusConfig.Pending;
                            return (
                                <div key={order._id} className="rounded-2xl border overflow-hidden"
                                    style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>
                                    <div className="flex items-center justify-between px-4 py-3"
                                        style={{ background: "#faf7f2", borderBottom: "1px solid rgba(143,185,122,0.12)" }}>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-mono text-xs" style={{ color: "#9a8a7a" }}>#{order._id.slice(-8).toUpperCase()}</span>
                                            <span className="text-xs" style={{ color: "#9a8a7a" }}>
                                                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                            </span>
                                        </div>
                                        <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                                            style={{ background: st.bg, color: st.text }}>
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="px-4 py-3 space-y-1">
                                        <p className="font-semibold text-sm" style={{ color: "#2d2d2d" }}>{order.user?.firstName} {order.user?.lastName}</p>
                                        <p className="text-xs" style={{ color: "#9a8a7a" }}>{order.user?.email}</p>
                                        <div className="mt-2 space-y-0.5">
                                            {order.products?.map((p, idx) => (
                                                <p key={idx} className="text-xs" style={{ color: "#6b6b6b" }}>{p.productId?.productName} × {p.quantity}</p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-3"
                                        style={{ background: "#faf7f2", borderTop: "1px solid rgba(143,185,122,0.12)" }}>
                                        <span className="font-bold text-sm" style={{ color: "#3d6b40" }}>₹{order.amount?.toLocaleString("en-IN")}</span>
                                        <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)}
                                            className="text-xs px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                                            style={{ border: "1px solid rgba(143,185,122,0.3)", background: "#fff", color: "#2d4a2e" }}>
                                            {["Pending","Processing","Shipped","Delivered","Paid","Cancelled","Failed"].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminOrders;