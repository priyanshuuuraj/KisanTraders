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

const Products = () => {

  const { products: reduxProducts } = useSelector((state) => state.product); // ✅ listen to Redux

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 999999]);
  const [sortOrder, setSortOrder] = useState("");

  const dispatch = useDispatch();

  // Get Products on mount
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8000/api/v1/product/getallproducts"
      );
      if (res.data.success) {
        const clean = (res.data.products || []).filter(Boolean);
        setAllProducts(clean);
        setFilteredProducts(clean);
        dispatch(setProducts(clean));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sync allProducts when Redux is updated by AdminProduct (after edit/delete)
  useEffect(() => {
    if (reduxProducts && reduxProducts.length > 0) {
      const clean = reduxProducts.filter(Boolean);
      setAllProducts(clean);
    }
  }, [reduxProducts]);

  // Filter + Sort Logic — updates local filteredProducts only
  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts].filter(Boolean);

    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    filtered = filtered.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]
    );

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);
    }
    if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }

    setFilteredProducts(filtered);

  }, [search, category, brand, sortOrder, priceRange, allProducts]);

  // Initial Fetch
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="pt-32 pb-10">
      <div className="max-w-7xl mx-auto flex gap-7">

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

        <div className="flex flex-col flex-1">

          <div className="flex justify-end mb-6">
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-[180px] border-gray-200 focus:ring-0">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                loading={loading}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Products;
