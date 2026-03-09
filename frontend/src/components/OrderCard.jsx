import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const statusColors = {
    Paid: "bg-green-500",
    Pending: "bg-yellow-400",
    Processing: "bg-blue-400",
    Shipped: "bg-purple-400",
    Delivered: "bg-green-600",
    Failed: "bg-red-500",
    Cancelled: "bg-gray-400",
}

const OrderCard = ({ userOrder, onStatusChange, isAdmin = false }) => {
    const navigate = useNavigate()

    if (!userOrder || userOrder.length === 0) {
        return (
            <div className="text-center py-20">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium text-2xl">No Orders found for this user</p>
            </div>
        )
    }

    return (
        <div className="pr-20 flex flex-col gap-3">
            <div className="w-full p-35">

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        <ArrowLeft />
                    </Button>
                    <h1 className="text-2xl font-bold">Orders</h1>
                </div>

                <div className="space-y-6 w-full">
                    {userOrder.map((order) => (
                        <div
                            key={order._id}
                            className="shadow-lg rounded-2xl p-5 border border-gray-200 bg-white"
                        >
                            {/* Order Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">
                                    Order ID:{" "}
                                    <span className="text-gray-600 text-sm font-mono">{order._id}</span>
                                </h2>
                                <div className="flex items-center gap-3">
                                    <span className={`${statusColors[order.status] || "bg-orange-300"} text-white text-xs px-3 py-1 rounded-full`}>
                                        {order.status}
                                    </span>
                                    {/* Status dropdown for admin only */}
                                    {isAdmin && onStatusChange && (
                                        <select
                                            value={order.status}
                                            onChange={(e) => onStatusChange(order._id, e.target.value)}
                                            className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-pink-400"
                                        >
                                            {["Pending", "Processing", "Shipped", "Delivered", "Paid", "Cancelled", "Failed"].map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            {/* Amount & Date */}
                            <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                                <p>
                                    Amount:{" "}
                                    <span className="font-bold text-pink-600 text-base">
                                        {order.currency} {order.amount?.toFixed(2)}
                                    </span>
                                </p>
                                <p>{new Date(order.createdAt).toLocaleDateString("en-IN", {
                                    day: "numeric", month: "short", year: "numeric"
                                })}</p>
                            </div>

                            {/* Products */}
                            <ul className="space-y-2">
                                {order.products?.map((product, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center bg-gray-50 p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition"
                                        onClick={() => navigate(`/products/${product?.productId?._id}`)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product?.productId?.productImg?.[0]?.url}
                                                alt={product?.productId?.productName}
                                                className="w-14 h-14 rounded-lg object-cover border"
                                            />
                                            <div>
                                                <p className="text-sm font-medium line-clamp-1 w-[220px]">
                                                    {product?.productId?.productName}
                                                </p>
                                                <p className="text-xs text-gray-400">Qty: {product?.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-sm">
                                            ₹{(product?.productId?.productPrice * product?.quantity).toLocaleString("en-IN")}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Shipping Address */}
                            {order.shippingAddress && (
                                <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
                                    📦 {order.shippingAddress.city}, {order.shippingAddress.zip}
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OrderCard
