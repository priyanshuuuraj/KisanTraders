import React from "react";
import { Search, RotateCcw, Tag, Layers } from "lucide-react";

const FilterSidebar = ({ search, setSearch, category, setCategory, brand, setBrand, setPriceRange, allProducts, priceRange }) => {
  const UniqueCategory = ["All", ...new Set(allProducts.map(p => p.category))];
  const UniqueBrand = ["All", ...new Set(allProducts.map(p => p.brand))];

  const handleMinChange = (e) => {
    const v = Number(e.target.value);
    if (v <= priceRange[1]) setPriceRange([v, priceRange[1]]);
  };
  const handleMaxChange = (e) => {
    const v = Number(e.target.value);
    if (v >= priceRange[0]) setPriceRange([priceRange[0], v]);
  };
  const resetFilters = () => {
    setSearch(""); setCategory("All"); setBrand("All"); setPriceRange([0, 9999]);
  };

  const sectionLabel = (icon, text) => (
    <div className="flex items-center gap-2 mt-6 mb-3">
      <span style={{ color: "#8fb97a" }}>{icon}</span>
      <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#5c3d1e" }}>{text}</h3>
    </div>
  );

  return (
    <div
      className="hidden md:block w-60 rounded-2xl p-5 h-max sticky top-24 border"
      style={{ background: "#faf7f2", borderColor: "rgba(143,185,122,0.2)" }}
    >
      <h2 className="font-bold text-base mb-4" style={{ color: "#2d4a2e" }}>Filters</h2>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#9a8a7a" }} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm focus:outline-none border-2 transition-all duration-150"
          style={{
            background: "#fff",
            borderColor: search ? "#8fb97a" : "rgba(0,0,0,0.08)",
            color: "#2d2d2d",
          }}
        />
      </div>

      {/* Category */}
      {sectionLabel(<Layers className="w-3.5 h-3.5" />, "Category")}
      <div className="flex flex-col gap-1.5">
        {UniqueCategory.map((item, i) => (
          <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
            <div
              className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0"
              style={{
                borderColor: category === item ? "#3d6b40" : "rgba(0,0,0,0.2)",
                background: category === item ? "#3d6b40" : "transparent",
              }}
              onClick={() => setCategory(item)}
            >
              {category === item && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <span
              className="text-sm transition-colors duration-150"
              style={{ color: category === item ? "#2d4a2e" : "#6b6b6b", fontWeight: category === item ? 600 : 400 }}
              onClick={() => setCategory(item)}
            >
              {item}
            </span>
          </label>
        ))}
      </div>

      {/* Brand */}
      {sectionLabel(<Tag className="w-3.5 h-3.5" />, "Brand")}
      <select
        value={brand}
        onChange={e => setBrand(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl text-sm border-2 focus:outline-none transition-all duration-150 cursor-pointer"
        style={{
          background: "#fff",
          borderColor: brand !== "All" ? "#8fb97a" : "rgba(0,0,0,0.08)",
          color: "#2d2d2d",
        }}
      >
        {UniqueBrand.map((item, i) => (
          <option key={i} value={item}>{item}</option>
        ))}
      </select>

      {/* Price Range */}
      {sectionLabel(
        <span className="text-xs font-bold" style={{ color: "#8fb97a" }}>₹</span>,
        "Price Range"
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-medium" style={{ color: "#3d6b40" }}>
          <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
          <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
        </div>

        {/* Visible range track */}
        <div className="relative h-5 flex items-center w-full overflow-hidden">
          {/* Full track */}
          <div className="absolute w-full h-2 rounded-full" style={{ background: "rgba(0,0,0,0.08)" }} />
          {/* Active range fill */}
          <div
            className="absolute h-2 rounded-full"
            style={{
              left: `${(priceRange[0] / 9999) * 100}%`,
              right: `${100 - (priceRange[1] / 9999) * 100}%`,
              background: "linear-gradient(90deg, #3d6b40, #8fb97a)",
            }}
          />
          {/* Min thumb */}
          <input
            type="range" min="0" max="9999" step="100"
            value={priceRange[0]}
            onChange={handleMinChange}
            className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer"
            style={{ accentColor: "#3d6b40" }}
          />
          {/* Max thumb */}
          <input
            type="range" min="0" max="9999" step="99"
            value={priceRange[1]}
            onChange={handleMaxChange}
            className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer"
            style={{ accentColor: "#8fb97a" }}
          />
        </div>

        <div className="flex gap-2">
          <input
            type="number" min="0" max="5000" value={priceRange[0]}
            onChange={handleMinChange}
            placeholder="Min"
            className="w-full px-2 py-1.5 rounded-lg text-xs border text-center focus:outline-none"
            style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2d2d2d" }}
          />
          <span className="text-gray-400 self-center">-</span>
          <input
            type="number" min="0" max="9999" value={priceRange[1]}
            onChange={handleMaxChange}
            placeholder="Max"
            className="w-full px-2 py-1.5 rounded-lg text-xs border text-center focus:outline-none"
            style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2d2d2d" }}
          />
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={resetFilters}
        className="w-full mt-6 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.97] border-2"
        style={{ borderColor: "#d4a574", color: "#7a4f2e", background: "rgba(212,165,116,0.08)" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(212,165,116,0.18)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(212,165,116,0.08)"}
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
