import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, CheckCircle2, ArrowLeft, Truck, ShieldCheck, RotateCcw, IndianRupee } from "lucide-react";
import { addAddress, setSelectedAddress, deleteAddress, setCart } from "../redux/productSlice";

const emptyForm = { fullName: "", phone: "", email: "", address: "", city: "", state: "", zip: "", country: "India" };

const AddressForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(s => s.user);
    const { cart, addresses, selectedAddress } = useSelector(s => s.product);

    const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true);
    const [focused, setFocused] = useState("");
    const [formData, setFormData] = useState({ ...emptyForm, fullName: `${user?.firstName||""} ${user?.lastName||""}`.trim(), phone: user?.phoneNo||"", email: user?.email||"", address: user?.address||"", city: user?.city||"", zip: user?.zipCode||"" });
    const [loading, setLoading] = useState(false);

    const subtotal = cart?.totalPrice || 0;
    const shipping = subtotal > 299 ? 0 : 49;
    const tax = parseFloat((subtotal * 0.05).toFixed(2));
    const total = subtotal + shipping + tax;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const fs = (name) => ({ borderColor: focused === name ? "#3d6b40" : "rgba(0,0,0,0.1)", boxShadow: focused === name ? "0 0 0 3px rgba(61,107,64,0.08)" : "none", transition: "all 0.15s" });

    const handleSave = () => {
        if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.zip) { toast.error("Please fill all required fields"); return; }
        const dup = addresses?.some(a => a.fullName === formData.fullName && a.phone === formData.phone && a.address === formData.address);
        if (dup) { toast.error("This address is already saved"); return; }
        dispatch(addAddress(formData));
        dispatch(setSelectedAddress(addresses.length));
        setFormData(emptyForm);
        setShowForm(false);
        toast.success("Address saved!");
    };

    const handlePayment = async () => {
        if (selectedAddress === null || selectedAddress === undefined) { toast.error("Please select a delivery address"); return; }
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) { toast.error("Please login"); navigate("/login"); return; }
        if (!cart?._id) { toast.error("Your cart is empty"); return; }
        setLoading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
                { products: cart?.items?.map(item => ({ productId: item.productId._id, quantity: item.quantity })), amount: total, tax, shipping, currency: "INR", shippingAddress: addresses[selectedAddress] },
                { headers: { Authorization: `Bearer ${accessToken}` } });
            if (!data.success) return toast.error("Something went wrong");

            let paymentSuccess = false;
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount, currency: data.order.currency, order_id: data.order.id,
                name: "Kisan Traders", description: "Order Payment",
                handler: async (response) => {
                    paymentSuccess = true;
                    try {
                        const v = await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`, response, { headers: { Authorization: `Bearer ${accessToken}` } });
                        if (v.data.success) { toast.success("Payment Successful!"); dispatch(setCart({ items: [], totalPrice: 0 })); navigate("/order-success"); }
                        else toast.error("Payment Verification failed");
                    } catch { toast.error("Error verifying payment"); }
                },
                modal: { ondismiss: async () => { if (paymentSuccess) return; try { await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`, { razorpay_order_id: data.order.id, paymentFailed: true }, { headers: { Authorization: `Bearer ${accessToken}` } }); } catch {} toast.error("Payment Cancelled"); } },
                prefill: { name: formData.fullName, email: formData.email, contact: formData.phone },
                theme: { color: "#3d6b40" },
            };
            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", async () => { if (paymentSuccess) return; try { await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`, { razorpay_order_id: data.order.id, paymentFailed: true }, { headers: { Authorization: `Bearer ${accessToken}` } }); } catch {} toast.error("Payment Failed"); });
            rzp.open();
        } catch (error) { toast.error("Something went wrong"); } finally { setLoading(false); }
    };

    const formFields = [
        { name: "fullName", label: "Full Name *", placeholder: "John Doe", grid: "col-span-2" },
        { name: "phone",    label: "Phone *",     placeholder: "9999999999" },
        { name: "email",    label: "Email",        placeholder: "you@email.com" },
        { name: "address",  label: "Address *",    placeholder: "House no, Street, Area", grid: "col-span-2" },
        { name: "city",     label: "City *",       placeholder: "Mumbai" },
        { name: "state",    label: "State",        placeholder: "Maharashtra" },
        { name: "zip",      label: "Zip Code *",   placeholder: "400001" },
        { name: "country",  label: "Country",      placeholder: "India" },
    ];

    return (
        <div className="pt-20 min-h-screen" style={{ background: "#f5f0e8" }}>
            <div className="max-w-6xl mx-auto px-6 py-10">

                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate("/cart")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all"
                        style={{ borderColor: "rgba(143,185,122,0.3)", color: "#3d6b40" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "#2d4a2e" }}>
                        <MapPin className="w-5 h-5" style={{ color: "#8fb97a" }} /> Delivery Address
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                    {/* LEFT: Address */}
                    <div className="rounded-2xl border p-6" style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>

                        {!showForm && addresses?.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="font-bold text-sm" style={{ color: "#2d4a2e" }}>Saved Addresses</h2>
                                {addresses.map((addr, index) => (
                                    <div key={index} onClick={() => dispatch(setSelectedAddress(index))}
                                        className="relative p-4 rounded-xl cursor-pointer transition-all duration-150"
                                        style={{
                                            border: selectedAddress === index ? "2px solid #3d6b40" : "2px solid rgba(0,0,0,0.08)",
                                            background: selectedAddress === index ? "rgba(143,185,122,0.06)" : "#fff",
                                        }}>
                                        {selectedAddress === index && <CheckCircle2 className="absolute top-3 right-10 w-4 h-4" style={{ color: "#3d6b40" }} />}
                                        <p className="font-semibold text-sm" style={{ color: "#2d2d2d" }}>{addr.fullName}</p>
                                        <p className="text-xs mt-0.5" style={{ color: "#9a8a7a" }}>{addr.phone} · {addr.email}</p>
                                        <p className="text-xs mt-0.5" style={{ color: "#6b6b6b" }}>
                                            {addr.address}, {addr.city}{addr.state ? `, ${addr.state}` : ""} — {addr.zip}, {addr.country}
                                        </p>
                                        <button onClick={e => { e.stopPropagation(); dispatch(deleteAddress(index)); if (selectedAddress === index) dispatch(setSelectedAddress(null)); }}
                                            className="absolute top-3 right-3 p-1 rounded-lg transition-all"
                                            style={{ color: "#c05050" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "rgba(200,80,80,0.1)"}
                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => setShowForm(true)}
                                    className="w-full py-2.5 rounded-xl text-sm font-medium border-dashed border-2 transition-all flex items-center justify-center gap-2"
                                    style={{ borderColor: "rgba(143,185,122,0.4)", color: "#3d6b40" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.06)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                    <Plus className="w-3.5 h-3.5" /> Add New Address
                                </button>
                                <button onClick={handlePayment}
                                    disabled={loading || selectedAddress === null || selectedAddress === undefined || showForm}
                                    className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.97] disabled:opacity-50"
                                    style={{ background: "linear-gradient(135deg, #2d4a2e, #3d6b40)", boxShadow: "0 2px 12px rgba(61,107,64,0.3)" }}>
                                    {loading ? "Processing..." : "Proceed to Payment →"}
                                </button>
                            </div>
                        )}

                        {showForm && (
                            <div className="space-y-4">
                                <h2 className="font-bold text-sm" style={{ color: "#2d4a2e" }}>
                                    {addresses?.length > 0 ? "Add New Address" : "Enter Delivery Address"}
                                </h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {formFields.map(f => (
                                        <div key={f.name} className={f.grid || ""}>
                                            <label className="text-xs font-semibold uppercase tracking-wide mb-1.5 block"
                                                style={{ color: focused === f.name ? "#3d6b40" : "#7a6a5a" }}>{f.label}</label>
                                            <input type="text" name={f.name} value={formData[f.name]} onChange={handleChange}
                                                placeholder={f.placeholder}
                                                onFocus={() => setFocused(f.name)} onBlur={() => setFocused("")}
                                                className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none"
                                                style={{ ...fs(f.name), color: "#2d2d2d", background: "#fff" }} />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-3 pt-1">
                                    <button onClick={handleSave}
                                        className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all"
                                        style={{ background: "#3d6b40" }}>
                                        Save & Continue
                                    </button>
                                    {addresses?.length > 0 && (
                                        <button onClick={() => setShowForm(false)}
                                            className="flex-1 py-3 rounded-xl font-medium text-sm border transition-all"
                                            style={{ borderColor: "rgba(0,0,0,0.1)", color: "#6b6b6b" }}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="rounded-2xl border p-6 space-y-4" style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>
                        <h2 className="font-bold text-sm" style={{ color: "#2d4a2e" }}>Order Summary</h2>

                        <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                            {cart?.items?.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <img src={item?.productId?.productImg?.[0]?.url} alt={item?.productId?.productName}
                                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                        style={{ border: "1px solid rgba(143,185,122,0.2)" }} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium line-clamp-1" style={{ color: "#2d2d2d" }}>{item?.productId?.productName}</p>
                                        <p className="text-xs" style={{ color: "#9a8a7a" }}>Qty: {item?.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold whitespace-nowrap" style={{ color: "#3d6b40" }}>
                                        ₹{(item?.productId?.productPrice * item?.quantity).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="h-px" style={{ background: "rgba(143,185,122,0.2)" }} />

                        <div className="space-y-2 text-sm">
                            {[
                                { label: `Subtotal (${cart?.items?.length} items)`, value: `₹${subtotal.toLocaleString("en-IN")}` },
                                { label: "Shipping", value: shipping === 0 ? "FREE" : `₹${shipping}`, green: shipping === 0 },
                                { label: "Tax (5%)", value: `₹${tax}` },
                            ].map(r => (
                                <div key={r.label} className="flex justify-between" style={{ color: "#6b6b6b" }}>
                                    <span>{r.label}</span>
                                    <span style={{ color: r.green ? "#3d6b40" : "#2d2d2d", fontWeight: 600 }}>{r.value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="h-px" style={{ background: "rgba(143,185,122,0.2)" }} />

                        <div className="flex justify-between font-bold" style={{ color: "#2d4a2e" }}>
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>

                        {shipping === 0 && (
                            <p className="text-xs text-center font-medium" style={{ color: "#3d6b40" }}>🎉 You get free shipping!</p>
                        )}

                        <p className="text-xs text-center" style={{ color: "#9a8a7a" }}>
                            {showForm ? "⚠️ Save your address first" : selectedAddress === null ? "⚠️ Please select an address" : "✅ Ready to pay"}
                        </p>

                        <div className="space-y-1.5 pt-1">
                            {[
                                { icon: <Truck className="w-3 h-3" />, text: "Free shipping over ₹299" },
                                { icon: <ShieldCheck className="w-3 h-3" />, text: "Secure SSL payment" },
                                { icon: <RotateCcw className="w-3 h-3" />, text: "30-day return policy" },
                            ].map(item => (
                                <div key={item.text} className="flex items-center gap-2 text-xs" style={{ color: "#9a8a7a" }}>
                                    <span style={{ color: "#8fb97a" }}>{item.icon}</span>{item.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressForm;