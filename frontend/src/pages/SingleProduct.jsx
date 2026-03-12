import React from "react";
import ProductImg from "@/components/ProductImg";
import ProductDesc from "@/components/ProductDesc";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SingleProduct = () => {
  const params = useParams();
  const productId = params.id;
  const navigate = useNavigate();

  const { products } = useSelector((store) => store.product);
  const product = products.find((item) => item._id === productId);

  if (!product) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center" style={{ background: "#f5f0e8" }}>
        <p className="text-sm" style={{ color: "#9a8a7a" }}>Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16" style={{ background: "#f5f0e8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Back button */}
        <div className="pt-4 sm:pt-20 mb-3 sm:mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all"
            style={{ borderColor: "rgba(143,185,122,0.3)", color: "#3d6b40", background: "#fff" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs product={product} />

        {/* Product layout */}
        <div className="mt-5 sm:mt-8 grid grid-cols-1 md:grid-cols-2 items-start gap-6 md:gap-10">
          <ProductImg images={product.productImg} />
          <ProductDesc product={product} />
        </div>

      </div>
    </div>
  );
};

export default SingleProduct;