import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Users, Package, ShoppingBag, IndianRupee, TrendingUp } from 'lucide-react'

const AdminSales = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalSales: 0, sales: [] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken")
                const { data } = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/sales`,
                    { headers: { Authorization: `Bearer ${accessToken}` } })
                if (data.success) setStats({ totalUsers: data.totalUsers, totalProducts: data.totalProducts, totalOrders: data.totalOrders, totalSales: data.totalSales, sales: data.sales || [] })
            } catch (error) { console.error(error) } finally { setLoading(false) }
        }
        fetchStats()
    }, [])

    const statCards = [
        { title: "Total Users",    value: stats.totalUsers,    icon: <Users className="w-5 h-5" />,       accent: "#8fb97a", bg: "rgba(143,185,122,0.12)" },
        { title: "Total Products", value: stats.totalProducts, icon: <Package className="w-5 h-5" />,     accent: "#d4a574", bg: "rgba(212,165,116,0.12)" },
        { title: "Total Orders",   value: stats.totalOrders,   icon: <ShoppingBag className="w-5 h-5" />, accent: "#5a9ec8", bg: "rgba(90,158,200,0.12)"  },
        { title: "Total Revenue",  value: `₹${stats.totalSales?.toLocaleString("en-IN")}`, icon: <IndianRupee className="w-5 h-5" />, accent: "#3d6b40", bg: "rgba(61,107,64,0.12)" },
    ]

    if (loading) return (
        <div className="pl-[260px] py-20 flex items-center justify-center gap-2 text-sm" style={{ color: "#9a8a7a" }}>
            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#8fb97a", borderTopColor: "transparent" }} />
            Loading dashboard...
        </div>
    )

    return (
        <div className="pl-[260px] min-h-screen py-25 pr-6" style={{ background: "#f5f0e8" }}>
            <div className="mb-8">
                <h1 className="text-xl font-bold" style={{ color: "#2d4a2e" }}>Dashboard</h1>
                <p className="text-xs mt-0.5" style={{ color: "#9a8a7a" }}>Overview of your store performance</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((card, i) => (
                    <div key={i} className="rounded-2xl border p-5 transition-all hover:shadow-md"
                        style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#9a8a7a" }}>{card.title}</p>
                            <div className="p-2 rounded-xl" style={{ background: card.bg, color: card.accent }}>
                                {card.icon}
                            </div>
                        </div>
                        <p className="text-2xl font-bold" style={{ color: "#2d4a2e" }}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="rounded-2xl border p-6" style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-4 h-4" style={{ color: "#8fb97a" }} />
                    <h2 className="font-bold text-base" style={{ color: "#2d4a2e" }}>Sales — Last 30 Days</h2>
                </div>
                <div style={{ height: 300 }}>
                    {stats.sales.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-sm" style={{ color: "#9a8a7a" }}>
                            No sales data available
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.sales} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#3d6b40" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#3d6b40" stopOpacity={0}    />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(143,185,122,0.15)" />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9a8a7a" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: "#9a8a7a" }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ background: "#fff", border: "1px solid rgba(143,185,122,0.3)", borderRadius: "12px", fontSize: "12px" }}
                                    formatter={value => [`₹${value.toLocaleString("en-IN")}`, "Sales"]}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#3d6b40" fill="url(#salesGradient)" strokeWidth={2.5} dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminSales