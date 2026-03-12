import { ShoppingCart, Heart } from "lucide-react";
import React, { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setCart } from "../redux/productSlice";

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName, category } = product || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [wished, setWished] = useState(false);

  const addToCart = async (productId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) { navigate("/login"); return; }
    if (adding) return;
    setAdding(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/cart/add`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.data.success) {
        toast.success("Product added to cart");
        dispatch(setCart(res.data.cart));
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add product");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="rounded-2xl overflow-hidden border flex gap-3 p-3"
      style={{ background: "#fff", borderColor: "rgba(0,0,0,0.06)" }}>
      <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-full h-8 rounded-xl mt-2" />
      </div>
    </div>
  );

  return (
    <div
      className="rounded-2xl overflow-hidden border group transition-all duration-200 hover:shadow-lg flex gap-3 p-3"
      style={{ background: "#fff", borderColor: "rgba(0,0,0,0.06)" }}
    >
      {/* Image */}
      <div
        className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 relative cursor-pointer"
        style={{ background: "#f5f0e8" }}
        onClick={() => navigate(`/products/${product._id}`)}
      >
        <img
          src={productImg?.[0]?.url}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0 justify-between py-0.5">
        <div>
          {category && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: "rgba(143,185,122,0.12)", color: "#3d6b40" }}>
              {category}
            </span>
          )}
          <h1
            className="font-semibold text-sm line-clamp-2 leading-snug mt-1 cursor-pointer"
            style={{ color: "#2d2d2d" }}
            onClick={() => navigate(`/products/${product._id}`)}
          >
            {productName}
          </h1>
        </div>

        <div className="flex items-center justify-between mt-2 gap-2">
          <p className="font-bold text-base flex-shrink-0" style={{ color: "#3d6b40" }}>
            ₹{productPrice?.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setWished(w => !w)}
              className="p-1.5 rounded-lg transition-all touch-manipulation"
              style={{ background: wished ? "rgba(220,80,80,0.08)" : "rgba(0,0,0,0.04)" }}>
              <Heart className="w-3.5 h-3.5"
                style={{ color: wished ? "#dc5050" : "#aaa", fill: wished ? "#dc5050" : "none" }} />
            </button>
            <button
              onClick={() => addToCart(product._id)}
              disabled={adding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.97] disabled:opacity-60 touch-manipulation"
              style={{ background: adding ? "#a0c896" : "#3d6b40", color: "#fff" }}
              onMouseEnter={e => { if (!adding) e.currentTarget.style.background = "#2d4a2e" }}
              onMouseLeave={e => { if (!adding) e.currentTarget.style.background = "#3d6b40" }}
            >
              <ShoppingCart size={13} />
              {adding ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;