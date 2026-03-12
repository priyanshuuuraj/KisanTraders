import React, { useState, useEffect } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";
import { PackageSearch, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const { products: reduxProducts } = useSelector((state) => state.product);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [sortOrder, setSortOrder] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/product/getallproducts`);
      if (res.data.success) {
        const clean = (res.data.products || []).filter(Boolean);
        setAllProducts(clean);
        setFilteredProducts(clean);
        dispatch(setProducts(clean));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reduxProducts?.length > 0) setAllProducts(reduxProducts.filter(Boolean));
  }, [reduxProducts]);

  useEffect(() => {
    if (allProducts.length === 0) return;
    let filtered = [...allProducts].filter(Boolean);
    if (search.trim()) filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") filtered = filtered.filter(p => p.category === category);
    if (brand !== "All") filtered = filtered.filter(p => p.brand === brand);
    filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]);
    if (sortOrder === "lowToHigh") filtered.sort((a, b) => a.productPrice - b.productPrice);
    if (sortOrder === "highToLow") filtered.sort((a, b) => b.productPrice - a.productPrice);
    setFilteredProducts(filtered);
  }, [search, category, brand, sortOrder, priceRange, allProducts]);

  useEffect(() => { getAllProducts(); }, []);

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16 sm:pb-10" style={{ background: "#f5f0e8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Page header */}
        <div className="pt-4 sm:pt-20 pb-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl text-sm border transition-all"
            style={{ borderColor: "rgba(143,185,122,0.3)", color: "#3d6b40", background: "#fff" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: "#2d4a2e" }}>All Products</h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: "#9a8a7a" }}>
            {loading ? "Loading..." : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Main layout */}
        <div className="flex gap-4 sm:gap-6 mt-3 items-start">

          <FilterSidebar
            search={search}
            setSearch={setSearch}
            brand={brand}
            setBrand={setBrand}
            category={category}
            setCategory={setCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            allProducts={allProducts}
          />

          {/* Products column */}
          <div className="flex flex-col flex-1 min-w-0">

            {/* Sort row */}
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <p className="text-xs sm:text-sm hidden sm:block" style={{ color: "#9a8a7a" }}>
                {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}
              </p>
              <div className="ml-auto">
                <Select onValueChange={(value) => setSortOrder(value)}>
                  <SelectTrigger
                    className="w-[148px] sm:w-[180px] text-xs sm:text-sm focus:ring-0 rounded-xl"
                    style={{ borderColor: "rgba(0,0,0,0.1)", background: "#fff" }}
                  >
                    <SelectValue placeholder="Sort by Price" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-md z-50">
                    <SelectGroup>
                      <SelectItem value="lowToHigh">Price: Low → High</SelectItem>
                      <SelectItem value="highToLow">Price: High → Low</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCard key={i} product={{}} loading={true} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(143,185,122,0.1)" }}>
                  <PackageSearch className="w-8 h-8" style={{ color: "#c5d9b8" }} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-base" style={{ color: "#2d4a2e" }}>No products found</p>
                  <p className="text-sm mt-1" style={{ color: "#9a8a7a" }}>Try adjusting your filters or search term</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} loading={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;