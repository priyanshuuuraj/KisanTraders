import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Package, ChevronRight, Calendar, Hash, ArrowLeft } from 'lucide-react'

const statusConfig = {
    Paid:       { bg: "rgba(143,185,122,0.15)", text: "#3d6b40",  dot: "#8fb97a"  },
    Pending:    { bg: "rgba(212,165,116,0.15)", text: "#7a4f2e",  dot: "#d4a574"  },
    Processing: { bg: "rgba(100,160,200,0.15)", text: "#2a5a7a",  dot: "#5a9ec8"  },
    Shipped:    { bg: "rgba(160,120,200,0.15)", text: "#5a3a7a",  dot: "#9a6ac8"  },
    Delivered:  { bg: "rgba(80,180,120,0.15)",  text: "#2a6a4a",  dot: "#50b478"  },
    Failed:     { bg: "rgba(220,80,80,0.12)",   text: "#8a2a2a",  dot: "#dc5050"  },
    Cancelled:  { bg: "rgba(150,140,130,0.12)", text: "#6a6058",  dot: "#9a9088"  },
}

const MyOrder = () => {
    const [userOrder, setUserOrder] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const getUserOrders = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken")
            const res = await axios.get(
                `${import.meta.env.VITE_URL}/api/v1/orders/myorder`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            if (res.data.success) setUserOrder(res.data.orders)
        } catch (error) {
            console.error("Failed to fetch orders:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { getUserOrders() }, [])

    if (loading) return (
        <div className="flex items-center justify-center py-20 gap-2 text-sm" style={{ color: "#9a8a7a" }}>
            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "#8fb97a", borderTopColor: "transparent" }} />
            Loading orders...
        </div>
    )

    if (!userOrder || userOrder.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="rounded-full p-6 mb-4" style={{ background: "rgba(143,185,122,0.1)" }}>
                <Package className="w-10 h-10" style={{ color: "#c5d9b8" }} />
            </div>
            <p className="font-bold text-base" style={{ color: "#2d4a2e" }}>No orders yet</p>
            <p className="text-sm mt-1" style={{ color: "#9a8a7a" }}>Your orders will appear here once you place one</p>
            <button
                onClick={() => navigate("/products")}
                className="mt-5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.97]"
                style={{ background: "#3d6b40", color: "#fff" }}
                onMouseEnter={e => e.currentTarget.style.background = "#2d4a2e"}
                onMouseLeave={e => e.currentTarget.style.background = "#3d6b40"}>
                Start Shopping
            </button>
        </div>
    )

    return (
        <div className="px-2 sm:px-4 py-20 space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate(-1)}
                        className="p-2 rounded-xl border transition-all"
                        style={{ borderColor: "rgba(143,185,122,0.3)", color: "#3d6b40", background: "#fff" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                        <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <h2 className="text-base font-bold" style={{ color: "#2d4a2e" }}>Order History</h2>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: "rgba(143,185,122,0.12)", color: "#3d6b40" }}>
                    {userOrder.length} order{userOrder.length !== 1 ? "s" : ""}
                </span>
            </div>

            {userOrder.map((order) => {
                const status = statusConfig[order.status] || statusConfig.Pending
                return (
                    <div key={order._id}
                        className="rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-md"
                        style={{ border: "1px solid rgba(143,185,122,0.2)", background: "#fff" }}>

                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 px-8 md:px-5 py-4"
                            style={{ background: "#faf7f2", borderBottom: "1px solid rgba(143,185,122,0.12)" }}>
                            <div className="flex flex-wrap items-center gap-2 md:gap-4">
                                <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "#9a8a7a" }}>
                                    <Hash className="w-3 h-3" />
                                    {order._id.slice(-8).toUpperCase()}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#9a8a7a" }}>
                                    <Calendar className="w-3 h-3" />
                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric", month: "short", year: "numeric"
                                    })}
                                </div>
                            </div>
                            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                                style={{ background: status.bg, color: status.text }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
                                {order.status}
                            </span>
                        </div>

                        {/* Products */}
                        <div className="px-4 md:px-5 py-4 space-y-3">
                            {order.products?.map((product, index) => (
                                <div key={index}
                                    className="flex items-center gap-3 cursor-pointer group rounded-xl p-2 -mx-2 transition-all duration-150"
                                    onClick={() => navigate(`/products/${product?.productId?._id}`)}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.06)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                    <img
                                        src={product?.productId?.productImg?.[0]?.url}
                                        alt={product?.productId?.productName}
                                        className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover flex-shrink-0"
                                        style={{ border: "1px solid rgba(143,185,122,0.2)" }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium line-clamp-1" style={{ color: "#2d2d2d" }}>
                                            {product?.productId?.productName}
                                        </p>
                                        <p className="text-xs mt-0.5" style={{ color: "#9a8a7a" }}>Qty: {product?.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold flex-shrink-0" style={{ color: "#3d6b40" }}>
                                        ₹{(product?.productId?.productPrice * product?.quantity).toLocaleString("en-IN")}
                                    </p>
                                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "#c5d9b8" }} />
                                </div>
                            ))}
                        </div>

                        {/* Order Footer */}
                        <div className="flex items-center justify-between px-4 md:px-5 py-3"
                            style={{ background: "#faf7f2", borderTop: "1px solid rgba(143,185,122,0.12)" }}>
                            {order.shippingAddress ? (
                                <p className="text-xs flex items-center gap-1" style={{ color: "#9a8a7a" }}>
                                    <Package className="w-3 h-3" style={{ color: "#d4a574" }} />
                                    {order.shippingAddress.city}{order.shippingAddress.zipCode ? `, ${order.shippingAddress.zipCode}` : ""}
                                </p>
                            ) : <span />}
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs" style={{ color: "#9a8a7a" }}>Total</span>
                                <span className="text-sm font-bold" style={{ color: "#3d6b40" }}>
                                    ₹{order.amount?.toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MyOrder
