import React, { useEffect, useState, useCallback } from 'react';
import { 
    Users, Package, ShoppingCart, IndianRupee, Store, 
    UserCheck, ShieldCheck, CheckCircle, Clock, Eye, LogOut, X
} from 'lucide-react';
import API from '../utils/app';

const AdminDashboard = ({ setView }) => {
    const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
    const [artisanData, setArtisanData] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State for the Image Viewer/Inspection Modal
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchAllAdminData = useCallback(async () => {
        try {
            const [statsRes, performanceRes, customerRes, productRes] = await Promise.all([
                API.get("/admin/stats"),
                API.get("/admin/artisan-performance"),
                API.get("/admin/customer-stats"),
                API.get("/admin/all")
            ]);
            
            setStats(statsRes.data.data);
            setArtisanData(performanceRes.data.data);
            setCustomerData(customerRes.data.data);
            setAllProducts(productRes.data.data);
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllAdminData();
    }, [fetchAllAdminData]);

    const handleToggleApproval = async (productId) => {
        try {
            const response = await API.patch(`/admin/approve-product/${productId}`);
            if (response.status === 200) {
                // If we are approving from inside the modal, close it after success
                if (selectedProduct && selectedProduct._id === productId) {
                    setSelectedProduct(null);
                }
                await fetchAllAdminData();
            }
        } catch (err) {
            alert("Failed to update product status");
        }
    };

    const handleToggleVerification = async (userId) => {
        try {
            const response = await API.patch(`/admin/verify-artisan/${userId}`);
            if (response.status === 200) {
                alert("Artisan verification status updated!");
                await fetchAllAdminData();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Verification failed";
            alert(errorMessage); 
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center font-bold text-[#2D6A4F] animate-pulse">
            Syncing Command Center...
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* 🛠 ADMIN TOP NAV */}
            <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-[#52B788] p-2 rounded-lg text-gray-900">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight">ArtLink Admin</h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Management Console</p>
                    </div>
                </div>
                
                <button 
                    onClick={() => setView('login')}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all text-sm font-bold text-white"
                >
                    <LogOut size={16} className="text-red-400" />
                    Exit to Portal
                </button>
            </nav>

            <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
                {/* 📊 Analytics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<IndianRupee />} bgColor="bg-green-100" />
                    <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCart />} bgColor="bg-blue-100" />
                    <StatCard title="Active Users" value={stats.totalUsers} icon={<Users />} bgColor="bg-purple-100" />
                    <StatCard title="Total Products" value={stats.totalProducts} icon={<Package />} bgColor="bg-orange-100" />
                </div>

                <div className="grid grid-cols-1 gap-10">
                    
                    {/* 🥇 1. PRODUCT APPROVALS SECTION */}
                    <DashboardTable 
                        title="Product Approvals" 
                        icon={<Package className="text-orange-500" />}
                        headers={["Product Name", "Price", "Status", "Inspection", "Action"]}
                    >
                        {allProducts.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                                <td className="px-6 py-4 font-bold text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 text-gray-500 font-medium">₹{product.price}</td>
                                <td className="px-6 py-4">
                                    {product.isApproved ? 
                                        <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={14}/> Approved</span> : 
                                        <span className="text-orange-500 font-bold flex items-center gap-1"><Clock size={14}/> Pending</span>
                                    }
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => setSelectedProduct(product)}
                                        className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                                    >
                                        <Eye size={14} /> View Product
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleToggleApproval(product._id)}
                                        className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${product.isApproved ? 'text-red-500 border-red-100 hover:bg-red-50' : 'text-green-600 border-green-100 hover:bg-green-50'}`}
                                    >
                                        {product.isApproved ? "Disapprove" : "Approve"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </DashboardTable>

                    {/* 🎨 2. ARTISAN MANAGEMENT */}
                    <DashboardTable 
                        title="Artisan Management" 
                        icon={<Store className="text-[#2D6A4F]" />}
                        headers={["Artisan", "Verification", "ID Proof", "Items", "Action"]}
                    >
                        {artisanData.map((artisan) => {
                            const idLink = artisan.idProof || artisan.idDocument || artisan.verificationUrl || artisan.document;
                            
                            return (
                                <tr key={artisan._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold">{artisan.username}</td>
                                    <td className="px-6 py-4">
                                        {artisan.isVerified ? 
                                            <span className="text-blue-600 font-bold flex items-center gap-1"><ShieldCheck size={14}/> Verified</span> : 
                                            <span className="text-gray-400 italic">Pending</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        {idLink ? (
                                            <a 
                                                href={idLink} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="flex items-center gap-1 text-blue-500 hover:underline font-bold text-xs"
                                            >
                                                <Eye size={14} /> View Document
                                            </a>
                                        ) : (
                                            <span className="text-red-400 text-xs">No ID Uploaded</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold">{artisan.productCount}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleToggleVerification(artisan._id)}
                                            className={`font-bold text-xs transition-colors ${artisan.isVerified ? 'text-red-400 hover:text-red-600' : 'text-[#2D6A4F] hover:underline'}`}
                                        >
                                            {artisan.isVerified ? "Revoke Verification" : "Verify Artisan"}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </DashboardTable>

                    {/* 🛒 3. CUSTOMER INSIGHTS */}
                    <DashboardTable 
                        title="Customer Insights" 
                        icon={<UserCheck className="text-blue-600" />}
                        headers={["Customer Name", "Total Orders", "Total Spent"]}
                    >
                        {customerData.map((customer) => (
                            <tr key={customer._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold">{customer.username}</td>
                                <td className="px-6 py-4 text-gray-600 font-medium">{customer.orderCount} orders</td>
                                <td className="px-6 py-4 text-right font-black text-blue-700">₹{customer.totalSpent.toLocaleString()}</td>
                            </tr>
                        ))}
                    </DashboardTable>
                </div>
            </div>

            {/* 🖼️ PRODUCT INSPECTION MODAL */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Modal Header/Image */}
                        <div className="relative h-72 bg-gray-100">
                            <img 
    // Try all common keys and ensure the path is correct
    src={
        selectedProduct.mainImage || 
        selectedProduct.image || 
        selectedProduct.productImage || 
        "https://via.placeholder.com/400"
    } 
    alt={selectedProduct.name}
    className="w-full h-full object-cover"
    // This will catch broken links and show a placeholder instead of a blank space
    onError={(e) => {
        e.target.onerror = null; 
        e.target.src = "https://via.placeholder.com/400?text=Image+Not+Found";
    }}
/>
                            <button 
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">{selectedProduct.name}</h3>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Quality Inspection Required</p>
                                </div>
                                <span className="text-2xl font-black text-[#2D6A4F]">₹{selectedProduct.price}</span>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100">
                                <p className="text-sm text-gray-500 leading-relaxed italic">
                                    "Inspect the handicraft details and image clarity. Approved products will be immediately visible to all customers on the ArtLink marketplace."
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setSelectedProduct(null)}
                                    className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleToggleApproval(selectedProduct._id)}
                                    className={`flex-1 py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${selectedProduct.isApproved ? 'bg-red-500 hover:bg-red-600' : 'bg-[#2D6A4F] hover:bg-[#1B4332]'}`}
                                >
                                    {selectedProduct.isApproved ? "Disapprove" : "Approve Product"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-components
const DashboardTable = ({ title, icon, headers, children }) => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {icon} {title}
            </h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-wider">
                    <tr>
                        {headers.map((h, i) => (
                            <th key={i} className={`px-6 py-4 ${i === headers.length - 1 ? 'text-right' : ''}`}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                    {children}
                </tbody>
            </table>
        </div>
    </div>
);

const StatCard = ({ title, value, icon, bgColor }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
        <div className={`${bgColor} p-4 rounded-2xl`}>{icon}</div>
        <div>
            <p className="text-xs text-gray-400 font-bold uppercase">{title}</p>
            <p className="text-2xl font-black text-gray-900">{value}</p>
        </div>
    </div>
);

export default AdminDashboard;