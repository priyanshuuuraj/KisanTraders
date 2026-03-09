import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setCart } from "../redux/productSlice";

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName } = product || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

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
    <div className="rounded-2xl overflow-hidden border" style={{ background: "#fff", borderColor: "rgba(0,0,0,0.06)" }}>
      <Skeleton className="w-full aspect-square" />
      <div className="p-3 space-y-2">
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-full h-9 rounded-xl" />
      </div>
    </div>
  );

  return (
    <div
      className="rounded-2xl overflow-hidden border group transition-all duration-200 hover:shadow-lg"
      style={{ background: "#fff", borderColor: "rgba(0,0,0,0.06)" }}
    >
      {/* Image */}
      <div className="w-full aspect-square overflow-hidden relative" style={{ background: "#f5f0e8" }}>
        <img
          src={productImg?.[0]?.url}
          alt={productName}
          onClick={() => navigate(`/products/${product._id}`)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
        />
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h1 className="font-semibold text-sm line-clamp-2 leading-snug h-10" style={{ color: "#2d2d2d" }}>
          {productName}
        </h1>
        <p className="font-bold text-base" style={{ color: "#3d6b40" }}>₹{productPrice?.toLocaleString("en-IN")}</p>
        <button
          onClick={() => addToCart(product._id)}
          disabled={adding}
          className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.97] disabled:opacity-60"
          style={{ background: adding ? "#a0c896" : "#3d6b40", color: "#fff" }}
          onMouseEnter={e => { if (!adding) e.currentTarget.style.background = "#2d4a2e" }}
          onMouseLeave={e => { if (!adding) e.currentTarget.style.background = "#3d6b40" }}
        >
          <ShoppingCart size={15} />
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
