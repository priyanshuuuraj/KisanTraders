import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Eye, Search, ShieldCheck, Wrench, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserLogo from "../../assets/def.png";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/user/all-user`,
                    { headers: { Authorization: `Bearer ${accessToken}` } });
                if (res.data.success) setUsers(res.data.users);
            } catch (error) { console.error(error); }
        };
        getAllUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="md:ml-[260px] min-h-screen py-6 md:py-10 px-4 md:px-8" style={{ background: "#f5f0e8" }}>

            {/* Back button mobile */}
            <button onClick={() => navigate(-1)}
                className="flex md:hidden items-center gap-2 mb-4 px-3 py-2 rounded-xl text-sm border"
                style={{ borderColor: "rgba(143,185,122,0.3)", color: "#3d6b40", background: "#fff" }}>
                <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <div className="mb-5 md:mb-6">
                <h1 className="text-xl font-bold" style={{ color: "#2d4a2e" }}>User Management</h1>
                <p className="text-xs mt-0.5" style={{ color: "#9a8a7a" }}>{filteredUsers.length} registered users</p>
            </div>

            <div className="relative w-full sm:w-[360px] mb-5 md:mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#9a8a7a" }} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search users..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none"
                    style={{ background: "#fff", borderColor: "rgba(143,185,122,0.3)", color: "#2d2d2d" }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user, index) => (
                    <div key={user?._id || index}
                        className="rounded-2xl border p-4 md:p-5 transition-all hover:shadow-md"
                        style={{ background: "#fff", borderColor: "rgba(143,185,122,0.2)" }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 rounded-full p-0.5"
                                    style={{ background: user?.role === "admin" ? "linear-gradient(135deg, #d4a574, #8fb97a)" : "linear-gradient(135deg, #8fb97a, #5a9e5a)" }}>
                                    <img src={user?.profilePic || UserLogo} alt="" className="w-full h-full rounded-full object-cover border-2 border-white" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-semibold text-sm truncate" style={{ color: "#2d2d2d" }}>
                                    {user?.firstName} {user?.lastName}
                                </h2>
                                <p className="text-xs truncate" style={{ color: "#9a8a7a" }}>{user?.email}</p>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-flex items-center gap-1"
                                    style={{
                                        background: user?.role === "admin" ? "rgba(212,165,116,0.15)" : "rgba(143,185,122,0.12)",
                                        color: user?.role === "admin" ? "#7a4f2e" : "#3d6b40",
                                    }}>
                                    {user?.role === "admin" ? <ShieldCheck className="w-2.5 h-2.5" /> : <Wrench className="w-2.5 h-2.5" />}
                                    {user?.role || "user"}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all border"
                                style={{ borderColor: "rgba(143,185,122,0.3)", color: "#3d6b40", background: "rgba(143,185,122,0.06)" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(143,185,122,0.15)"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(143,185,122,0.06)"}>
                                <Edit className="w-3 h-3" /> Edit
                            </button>
                            <button onClick={() => navigate(`/dashboard/users/orders/${user?._id}`)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all border"
                                style={{ borderColor: "rgba(212,165,116,0.3)", color: "#7a4f2e", background: "rgba(212,165,116,0.06)" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(212,165,116,0.15)"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(212,165,116,0.06)"}>
                                <Eye className="w-3 h-3" /> Orders
                            </button>
                        </div>
                    </div>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="col-span-full text-center py-20" style={{ color: "#9a8a7a" }}>
                        <p className="font-medium">No users found</p>
                        <p className="text-xs mt-1">Try adjusting your search</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;