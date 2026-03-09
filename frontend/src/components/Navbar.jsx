import React, { useState, useEffect } from "react";
import { ShoppingCart, Wrench, LayoutDashboard, LogOut, LogIn, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Navbar = () => {
  const { user } = useSelector(store => store.user)
  const cart = useSelector(store => store.product.cart)
  const accessToken = localStorage.getItem("accessToken");
  const admin = user?.role === "admin"
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/logout`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.data.success) {
        dispatch(setUser(null))
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
  ]

  return (
    <header
      className="fixed w-full z-20 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(26,46,26,0.97)" : "#1a2e1a",
        borderBottom: scrolled ? "1px solid rgba(143,185,122,0.15)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.25)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl transition-all duration-200 group-hover:scale-105"
            style={{ background: "rgba(143,185,122,0.15)" }}>
            <Wrench className="w-4 h-4" style={{ color: "#8fb97a" }} />
          </div>
          <span className="font-bold text-base" style={{ color: "#f5f0e8" }}>Kisan Traders</span>
        </Link>

        {/* NAV LINKS */}
        <nav className="flex items-center gap-8">

          <ul className="flex gap-1 items-center">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}>
                <li className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
                  style={{
                    color: isActive(link.to) ? "#f5f0e8" : "rgba(245,240,232,0.55)",
                    background: isActive(link.to) ? "rgba(143,185,122,0.18)" : "transparent",
                  }}>
                  {link.label}
                </li>
              </Link>
            ))}

            {user && (
              <Link to={`/profile/${user._id}`}>
                <li className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer flex items-center gap-1.5"
                  style={{
                    color: isActive(`/profile/${user._id}`) ? "#f5f0e8" : "rgba(245,240,232,0.55)",
                    background: isActive(`/profile/${user._id}`) ? "rgba(143,185,122,0.18)" : "transparent",
                  }}
                  onMouseEnter={e => { if (!isActive(`/profile/${user._id}`)) e.currentTarget.style.color = "#f5f0e8" }}
                  onMouseLeave={e => { if (!isActive(`/profile/${user._id}`)) e.currentTarget.style.color = "rgba(245,240,232,0.55)" }}
                >
                  <User className="w-3.5 h-3.5" />
                  {user.firstName}
                </li>
              </Link>
            )}

            {admin && (
              <Link to="/dashboard/sales">
                <li className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer flex items-center gap-1.5"
                  style={{
                    color: location.pathname.startsWith("/dashboard") ? "#f5f0e8" : "rgba(245,240,232,0.55)",
                    background: location.pathname.startsWith("/dashboard") ? "rgba(212,165,116,0.18)" : "transparent",
                  }}
                  onMouseEnter={e => { if (!location.pathname.startsWith("/dashboard")) e.currentTarget.style.color = "#f5f0e8" }}
                  onMouseLeave={e => { if (!location.pathname.startsWith("/dashboard")) e.currentTarget.style.color = "rgba(245,240,232,0.55)" }}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </li>
              </Link>
            )}
          </ul>

          {/* DIVIDER */}
          <div className="w-px h-5" style={{ background: "rgba(245,240,232,0.1)" }} />

          {/* CART */}
          <Link to="/cart" className="relative group">
            <div className="p-2 rounded-xl transition-all duration-150"
              style={{ background: "rgba(245,240,232,0.06)" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(245,240,232,0.06)"}
            >
              <ShoppingCart className="w-5 h-5" style={{ color: "rgba(245,240,232,0.7)" }} />
            </div>
            {cart?.items?.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: "#8fb97a", color: "#1a2e1a" }}>
                {cart.items.length}
              </span>
            )}
          </Link>

          {/* AUTH BUTTON */}
          {user ? (
            <button
              onClick={logoutHandler}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.97]"
              style={{ background: "rgba(212,165,116,0.12)", color: "#d4a574", border: "1px solid rgba(212,165,116,0.2)" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(212,165,116,0.22)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(212,165,116,0.12)"}
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.97]"
              style={{ background: "#8fb97a", color: "#1a2e1a" }}
              onMouseEnter={e => e.currentTarget.style.background = "#7aa868"}
              onMouseLeave={e => e.currentTarget.style.background = "#8fb97a"}
            >
              <LogIn className="w-3.5 h-3.5" />
              Login
            </button>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Navbar;
