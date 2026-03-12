import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PackagePlus, Tag, FileText, Layers, IndianRupee, Image, ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const [productData, setProductData] = useState({ productName: "", productPrice: "", productDesc: "", productImg: [], brand: "", category: "" });

  const handleChange = (e) => setProductData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submitHandler = async (e) => {
    e.preventDefault();
    if (productData.productImg.length === 0) { toast.error("Please select at least one image"); return; }
    const formData = new FormData();
    ["productName","productPrice","productDesc","brand","category"].forEach(k => formData.append(k, productData[k]));
    productData.productImg.forEach(img => formData.append("productImg", img));
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/product/add`, formData,
        { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "multipart/form-data" } });
      if (res.data.success) { toast.success(res.data.message); setProductData({ productName: "", productPrice: "", productDesc: "", productImg: [], brand: "", category: "" }); }
    } catch (error) { toast.error("Something went wrong"); } finally { setLoading(false); }
  };

  const fields = [
    { label: "Product Name", name: "productName", type: "text", icon: <Tag className="w-3.5 h-3.5" />, placeholder: "e.g. Bosch Drill Machine" },
    { label: "Price (₹)", name: "productPrice", type: "number", icon: <IndianRupee className="w-3.5 h-3.5" />, placeholder: "e.g. 1299" },
    { label: "Brand", name: "brand", type: "text", icon: <Layers className="w-3.5 h-3.5" />, placeholder: "e.g. Bosch" },
    { label: "Category", name: "category", type: "text", icon: <FileText className="w-3.5 h-3.5" />, placeholder: "e.g. Power Tools" },
  ];

  const fieldStyle = (name) => ({ borderColor: focused === name ? "#3d6b40" : "rgba(0,0,0,0.1)", boxShadow: focused === name ? "0 0 0 3px rgba(61,107,64,0.08)" : "none", transition: "all 0.15s" });

  return (
    <div className="md:pl-[260px] min-h-screen pt-20 md:pt-10 pb-10 px-4 md:px-8" style={{ background: "#f5f0e8" }}>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <button onClick={() => navigate(-1)}
          className="p-2 rounded-xl border transition-all"
          style={{ borderColor: "rgba(143,185,122,0.3)", color: "#3d6b40", background: "#fff" }}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="p-2.5 rounded-xl" style={{ background: "rgba(143,185,122,0.15)" }}>
          <PackagePlus className="w-5 h-5" style={{ color: "#3d6b40" }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#2d4a2e" }}>Add New Product</h1>
          <p className="text-xs mt-0.5" style={{ color: "#9a8a7a" }}>Fill in the details to list a new product</p>
        </div>
      </div>

      <form onSubmit={submitHandler}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">

          {/* LEFT */}
          <div className="rounded-2xl border p-4 md:p-6 space-y-4" style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#5c3d1e" }}>Product Info</p>

            {fields.map(field => (
              <div key={field.name} className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5"
                  style={{ color: focused === field.name ? "#3d6b40" : "#7a6a5a" }}>
                  <span style={{ color: focused === field.name ? "#3d6b40" : "#9a8a7a" }}>{field.icon}</span>
                  {field.label}
                </label>
                <input name={field.name} type={field.type} value={productData[field.name]} onChange={handleChange}
                  placeholder={field.placeholder}
                  onFocus={() => setFocused(field.name)} onBlur={() => setFocused("")}
                  required={["productName","productPrice"].includes(field.name)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none"
                  style={{ ...fieldStyle(field.name), color: "#2d2d2d", background: "#fff" }} />
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a6a5a" }}>Description</label>
              <Textarea name="productDesc" value={productData.productDesc} onChange={handleChange}
                placeholder="Describe product features, specifications..."
                rows={4} className="rounded-xl resize-none text-sm border focus:outline-none focus-visible:ring-0"
                style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2d2d2d" }} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4 md:space-y-5">
            <div className="rounded-2xl border p-4 md:p-6" style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Image className="w-3.5 h-3.5" style={{ color: "#9a8a7a" }} />
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#5c3d1e" }}>Product Images</p>
              </div>
              <ImageUpload productData={productData} setProductData={setProductData} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #2d4a2e, #3d6b40)", color: "#fff", boxShadow: "0 2px 14px rgba(61,107,64,0.3)" }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = "0 4px 20px rgba(61,107,64,0.45)" }}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 14px rgba(61,107,64,0.3)"}>
              {loading ? <><Loader2 className="animate-spin w-4 h-4" />Uploading...</> : <><PackagePlus className="w-4 h-4" />Add Product</>}
            </button>
            <p className="text-xs text-center" style={{ color: "#b0a090" }}>Product will be visible to customers immediately after adding</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;