import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/ImageUpload";
import { setProducts } from "@/redux/productSlice";
import { Loader2, Pencil, Trash2, Search } from "lucide-react";

const AdminProduct = () => {
    const { products } = useSelector(s => s.product);
    const dispatch = useDispatch();
    const [editProduct, setEditProduct] = useState(null);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [focused, setFocused] = useState("");
    const accessToken = localStorage.getItem("accessToken");

    let filtered = (products || []).filter(Boolean).filter(p => p.productName?.toLowerCase().includes(searchTerm.toLowerCase()));
    if (sortOrder === "lowToHigh") filtered = [...filtered].sort((a,b) => a.productPrice - b.productPrice);
    if (sortOrder === "highToLow") filtered = [...filtered].sort((a,b) => b.productPrice - a.productPrice);

    const handleChange = (e) => setEditProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = async (e) => {
        e.preventDefault();
        if (!editProduct || !accessToken || loading) return;
        setLoading(true);
        try {
            const formData = new FormData();
            ["productName","productPrice","productDesc","brand","category"].forEach(k => formData.append(k, editProduct[k]));
            const existing = (editProduct.productImg || []).filter(img => !(img instanceof File) && img.public_id).map(img => img.public_id);
            formData.append("existingImages", JSON.stringify(existing));
            (editProduct.productImg || []).filter(img => img instanceof File).forEach(f => formData.append("productImg", f));
            const res = await axios.put(`${import.meta.env.VITE_URL}/api/v1/product/update/${editProduct._id}`, formData,
                { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "multipart/form-data" } });
            if (res.data.success) {
                toast.success("Product updated");
                const fresh = await axios.get(`${import.meta.env.VITE_URL}/api/v1/product/getallproducts`);
                if (fresh.data.success) dispatch(setProducts((fresh.data.products || []).filter(Boolean)));
                setOpen(false); setEditProduct(null);
            }
        } catch (error) { toast.error(error?.response?.data?.message || "Something went wrong"); } finally { setLoading(false); }
    };

    const deleteProductHandler = async (productId) => {
        if (!accessToken) return;
        setDeletingId(productId);
        try {
            const res = await axios.delete(`${import.meta.env.VITE_URL}/api/v1/product/delete/${productId}`,
                { headers: { Authorization: `Bearer ${accessToken}` } });
            if (res.data.success) { toast.success("Product deleted"); dispatch(setProducts(products.filter(p => p._id !== productId))); }
        } catch (error) { toast.error("Something went wrong"); } finally { setDeletingId(null); }
    };

    const fieldStyle = (name) => ({ borderColor: focused === name ? "#3d6b40" : "rgba(0,0,0,0.1)", boxShadow: focused === name ? "0 0 0 3px rgba(61,107,64,0.08)" : "none" });

    return (
        <div className="ml-[260px] min-h-screen py-25 px-8" style={{ background: "#f5f0e8" }}>
            <div className="mb-6">
                <h1 className="text-xl font-bold" style={{ color: "#2d4a2e" }}>Products</h1>
                <p className="text-xs mt-0.5" style={{ color: "#9a8a7a" }}>{filtered.length} items</p>
            </div>

            <div className="flex justify-between items-center mb-6 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#9a8a7a" }} />
                    <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-[360px] pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none"
                        style={{ background: "#fff", borderColor: "rgba(143,185,122,0.3)", color: "#2d2d2d" }} />
                </div>
                <Select onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[180px] rounded-xl text-sm" style={{ background: "#fff", borderColor: "rgba(143,185,122,0.3)" }}>
                        <SelectValue placeholder="Sort by Price" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                        <SelectItem value="highToLow">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-3">
                {filtered.length > 0 ? filtered.map((product, index) => (
                    <div key={product._id || index}
                        className="flex items-center gap-4 rounded-2xl px-5 py-4 border transition-all hover:shadow-md"
                        style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>
                        <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden" style={{ background: "#f5f0e8", border: "1px solid rgba(143,185,122,0.2)" }}>
                            {product.productImg?.[0]?.url
                                ? <img src={product.productImg[0].url} alt={product.productName} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "#c5b5a5" }}>No img</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="font-semibold text-sm line-clamp-1" style={{ color: "#2d2d2d" }}>{product.productName}</h1>
                            <p className="text-xs mt-0.5" style={{ color: "#9a8a7a" }}>
                                {product.category}{product.brand ? ` · ${product.brand}` : ""}
                            </p>
                        </div>
                        <p className="font-bold text-sm w-24 text-right" style={{ color: "#3d6b40" }}>
                            ₹{Number(product.productPrice).toLocaleString("en-IN")}
                        </p>
                        <div className="flex gap-3 items-center">
                            <Dialog open={open && editProduct?._id === product._id} onOpenChange={isOpen => { if (!isOpen) { setOpen(false); setEditProduct(null); } }}>
                                <DialogTrigger asChild>
                                    <button onClick={() => { setOpen(true); setEditProduct(product); }}
                                        className="p-2 rounded-lg transition-all"
                                        style={{ background: "rgba(143,185,122,0.1)", color: "#3d6b40" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.2)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "rgba(143,185,122,0.1)"}>
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
                                    <DialogHeader>
                                        <DialogTitle style={{ color: "#2d4a2e" }}>Edit Product</DialogTitle>
                                        <DialogDescription style={{ color: "#9a8a7a" }}>Make changes and click save when done.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSave} className="space-y-4 py-2">
                                        {[
                                            { label: "Product Name", name: "productName", type: "text" },
                                            { label: "Price (₹)", name: "productPrice", type: "number" },
                                        ].map(f => (
                                            <div key={f.name}>
                                                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a6a5a" }}>{f.label}</Label>
                                                <input type={f.type} name={f.name} value={editProduct?.[f.name] || ""} onChange={handleChange}
                                                    onFocus={() => setFocused(f.name)} onBlur={() => setFocused("")}
                                                    className="w-full mt-1.5 px-4 py-2.5 rounded-xl text-sm border focus:outline-none"
                                                    style={{ ...fieldStyle(f.name), color: "#2d2d2d" }} required />
                                            </div>
                                        ))}
                                        <div>
                                            <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#7a6a5a" }}>Description</Label>
                                            <Textarea name="productDesc" value={editProduct?.productDesc || ""} onChange={handleChange}
                                                className="mt-1.5 rounded-xl resize-none focus-visible:ring-0 text-sm" rows={3} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {["brand","category"].map(f => (
                                                <div key={f}>
                                                    <Label className="text-xs font-semibold uppercase tracking-wide capitalize" style={{ color: "#7a6a5a" }}>{f}</Label>
                                                    <input type="text" name={f} value={editProduct?.[f] || ""} onChange={handleChange}
                                                        onFocus={() => setFocused(f)} onBlur={() => setFocused("")}
                                                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl text-sm border focus:outline-none"
                                                        style={{ ...fieldStyle(f), color: "#2d2d2d" }} />
                                                </div>
                                            ))}
                                        </div>
                                        {editProduct && <ImageUpload productData={editProduct} setProductData={setEditProduct} />}
                                        <DialogFooter className="gap-2 pt-2">
                                            <button type="button" onClick={() => { setOpen(false); setEditProduct(null); }}
                                                className="px-4 py-2 rounded-xl text-sm border transition-all"
                                                style={{ borderColor: "rgba(0,0,0,0.15)", color: "#6b6b6b" }}>Cancel</button>
                                            <button type="submit" disabled={loading}
                                                className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
                                                style={{ background: "#3d6b40" }}>
                                                {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin w-3.5 h-3.5" />Saving...</span> : "Save Changes"}
                                            </button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button className="p-2 rounded-lg transition-all"
                                        style={{ background: "rgba(220,80,80,0.08)", color: "#c05050" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(220,80,80,0.15)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "rgba(220,80,80,0.08)"}>
                                        {deletingId === product._id
                                            ? <Loader2 className="animate-spin w-3.5 h-3.5" />
                                            : <Trash2 className="w-3.5 h-3.5" />}
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-2xl">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete this product?</AlertDialogTitle>
                                        <AlertDialogDescription>This action cannot be undone. The product will be permanently removed.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteProductHandler(product._id)}
                                            className="rounded-xl bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20" style={{ color: "#9a8a7a" }}>
                        <p className="font-medium">No products found</p>
                        <p className="text-xs mt-1">Try adjusting your search</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProduct;