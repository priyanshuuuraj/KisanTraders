import React, { useState, useEffect } from "react";
import { ShoppingCart, Wrench, LayoutDashboard, LogOut, LogIn, User, Menu, X } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])


  const logoutHandler = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (token) {
        await axios.post(
          `/api/v1/user/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      // Always clear state regardless of API success/fail
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(setUser(null));
      toast.success("Logged out successfully");
      setMobileOpen(false);
      navigate("/login");
    }
  };
  

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
  ]

  return (
    <>
      <header
        className="fixed w-full z-20 transition-all duration-300"
        style={{
          background: scrolled || mobileOpen ? "rgba(26,46,26,0.97)" : "#1a2e1a",
          borderBottom: scrolled ? "1px solid rgba(143,185,122,0.15)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.25)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl transition-all duration-200 group-hover:scale-105"
              style={{ background: "rgba(143,185,122,0.15)" }}>
              <Wrench className="w-4 h-4" style={{ color: "#8fb97a" }} />
            </div>
            <span className="font-bold text-base" style={{ color: "#f5f0e8" }}>Kisan Traders</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
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
                    }}>
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
                    }}>
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </li>
                </Link>
              )}
            </ul>

            <div className="w-px h-5" style={{ background: "rgba(245,240,232,0.1)" }} />

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

          {/* MOBILE RIGHT: Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart" className="relative">
              <div className="p-2 rounded-xl" style={{ background: "rgba(245,240,232,0.06)" }}>
                <ShoppingCart className="w-5 h-5" style={{ color: "rgba(245,240,232,0.7)" }} />
              </div>
              {cart?.items?.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ background: "#8fb97a", color: "#1a2e1a" }}>
                  {cart.items.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(o => !o)}
              className="p-2 rounded-xl transition-all duration-150"
              style={{ background: "rgba(245,240,232,0.06)", color: "rgba(245,240,232,0.8)" }}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DRAWER */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: mobileOpen ? "400px" : "0px",
            borderTop: mobileOpen ? "1px solid rgba(143,185,122,0.12)" : "none",
          }}
        >
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  color: isActive(link.to) ? "#f5f0e8" : "rgba(245,240,232,0.6)",
                  background: isActive(link.to) ? "rgba(143,185,122,0.18)" : "transparent",
                }}>
                {link.label}
              </Link>
            ))}

            {user && (
              <Link to={`/profile/${user._id}`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  color: isActive(`/profile/${user._id}`) ? "#f5f0e8" : "rgba(245,240,232,0.6)",
                  background: isActive(`/profile/${user._id}`) ? "rgba(143,185,122,0.18)" : "transparent",
                }}>
                <User className="w-4 h-4" />
                {user.firstName}'s Profile
              </Link>
            )}

            {admin && (
              <Link to="/dashboard/sales"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  color: location.pathname.startsWith("/dashboard") ? "#f5f0e8" : "rgba(245,240,232,0.6)",
                  background: location.pathname.startsWith("/dashboard") ? "rgba(212,165,116,0.18)" : "transparent",
                }}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}

            <div className="h-px my-2" style={{ background: "rgba(143,185,122,0.12)" }} />

            {user ? (
              <button onClick={logoutHandler}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium w-full"
                style={{ background: "rgba(212,165,116,0.12)", color: "#d4a574" }}>
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <button onClick={() => { navigate('/login'); setMobileOpen(false) }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold w-full justify-center"
                style={{ background: "#8fb97a", color: "#1a2e1a" }}>
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;