import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, PackagePlus, PackageSearch, Users, ShoppingBag, Wrench } from "lucide-react";

const navItems = [
  { to: "/dashboard/sales", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
  { to: "/dashboard/add-product", icon: <PackagePlus className="w-4 h-4" />, label: "Add Product" },
  { to: "/dashboard/products", icon: <PackageSearch className="w-4 h-4" />, label: "Products" },
  { to: "/dashboard/users", icon: <Users className="w-4 h-4" />, label: "Users" },
  { to: "/dashboard/orders", icon: <ShoppingBag className="w-4 h-4" />, label: "Orders" },
]

const Sidebar = () => {
  return (
    <div
      className="hidden fixed md:flex flex-col w-[240px] h-screen pt-20"
      style={{ background: "#1a2e1a", borderRight: "1px solid rgba(143,185,122,0.12)" }}
    >
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-2.5"
        style={{ borderBottom: "1px solid rgba(143,185,122,0.1)" }}>
        <div className="p-2 rounded-xl" style={{ background: "rgba(143,185,122,0.15)" }}>
          <Wrench className="w-4 h-4" style={{ color: "#8fb97a" }} />
        </div>
        <div>
          <p className="text-xs font-bold" style={{ color: "#f5f0e8" }}>Kisan Traders</p>
          <p className="text-xs" style={{ color: "rgba(245,240,232,0.35)" }}>Admin Panel</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3"
          style={{ color: "rgba(214, 172, 104, 0.25)" }}>
          Menu
        </p>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group"
            style={({ isActive }) => ({
              background: isActive ? "rgba(212, 244, 196, 0.18)" : "transparent",
              color: isActive ? "#ffffff" : "rgba(253, 253, 253, 0.5)",
              borderLeft: isActive ? "3px solid #78e740" : "3px solid transparent",
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.classList.contains("active")) {
                e.currentTarget.style.color = "rgba(245,240,232,0.85)"
                e.currentTarget.style.background = "rgba(215, 233, 210, 0.08)"
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.dataset.active) {
                e.currentTarget.style.color = ""
                e.currentTarget.style.background = ""
              }
            }}
          >
            <span style={{ color: "inherit" }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom info */}
      <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(143,185,122,0.1)" }}>
        <p className="text-xs" style={{ color: "rgba(245,240,232,0.2)" }}>© 2025 Kisan Traders</p>
      </div>
    </div>
  );
};

export default Sidebar;