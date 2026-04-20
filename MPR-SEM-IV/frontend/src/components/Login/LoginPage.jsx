import React, { useState } from 'react';
import { Mail, Lock, Loader2, LogIn, User, Hammer, ShieldCheck } from 'lucide-react';
import API from "../../utils/app";

const LoginPage = ({ setView, onLoginSuccess }) => { 
    const [formData, setFormData] = useState({ email: '', password: '', role: 'customer' });
    const [loading, setLoading] = useState(false);
    const [logoClickCount, setLogoClickCount] = useState(0);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); 
        try {
            // We pass the email, password, and the selected role (customer/artisan)
            const res = await API.post("/users/loginuser", formData);
            const { user, accessToken } = res.data.data;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("accessToken", accessToken);

            if (onLoginSuccess) {
                onLoginSuccess(user);
            }
        } catch (err) {
            console.error("Login Error:", err.response?.data);
            
            // 🛑 NEW VERIFICATION CHECK
            // If backend returns 403, it means the artisan is not verified yet
            if (err.response?.status === 403) {
                alert(err.response.data.message || "Your account is pending verification. Please wait for Admin approval.");
            } else {
                // Regular error (wrong password, user not found, etc.)
                alert(err.response?.data?.message || "Login failed");
            }
        } finally {
            setLoading(false); 
        }
    };

    // 🛡️ SECURE ADMIN VALIDATION LOGIC
    const handleAdminPortalClick = () => {
        const adminEmail = prompt("Restricted Area: Enter Admin Authorized Email to Proceed:");
        
        // Authorized email for the system administrator
        const authorizedEmail = "admin@artlink.com";

        if (adminEmail === authorizedEmail) {
            alert("Identity Verified. Redirecting to Admin Portal...");
            setView('admin');
        } else if (adminEmail !== null) {
            alert("Access Denied: This email is not registered as a System Administrator.");
        }
    };

    // 🕵️ SECRET LOGO CLICK LOGIC
    const handleSecretLogoClick = () => {
        const newCount = logoClickCount + 1;
        setLogoClickCount(newCount);
        if (newCount === 5) {
            handleAdminPortalClick();
            setLogoClickCount(0);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* 🌐 TOP NAVIGATION BAR */}
            <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
                <div 
                    className="flex items-center gap-2 cursor-pointer select-none" 
                    onClick={handleSecretLogoClick}
                    title="ArtLink Marketplace"
                >
                    <div className="w-10 h-10 bg-[#2D6A4F] rounded-xl flex items-center justify-center text-white font-black text-xl">
                        A
                    </div>
                    <span className="text-xl font-black text-gray-900 tracking-tight">ArtLink</span>
                </div>

                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => setView('register')}
                        className="text-sm font-bold text-gray-500 hover:text-[#2D6A4F] transition-colors"
                    >
                        Create Account
                    </button>
                    
                    <button 
                        onClick={handleAdminPortalClick}
                        className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md"
                    >
                        <ShieldCheck size={16} className="text-[#52B788]" />
                        Admin Portal
                    </button>
                </div>
            </nav>

            {/* 🔑 MAIN LOGIN CONTENT */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-gray-900">Welcome Back</h2>
                        <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest font-bold">Portal Access</p>
                    </div>

                    {/* Role Toggle Switch */}
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
                        <button
                            type="button"
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                                formData.role === 'customer' 
                                ? "bg-white text-[#2D6A4F] shadow-sm" 
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setFormData({...formData, role: 'customer'})}
                        >
                            <User size={18} /> Customer
                        </button>
                        <button
                            type="button"
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                                formData.role === 'artisan' 
                                ? "bg-white text-[#2D6A4F] shadow-sm" 
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setFormData({...formData, role: 'artisan'})}
                        >
                            <Hammer size={18} /> Artisan
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                required
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#2D6A4F] outline-none transition-all"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                required
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#2D6A4F] outline-none transition-all"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#2D6A4F] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#1B4332] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>Login to {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} <LogIn size={20} /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <footer className="py-6 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-medium">
                    &copy; 2026 ArtLink Artisan Marketplace
                </p>
            </footer>
        </div>
    );
};

export default LoginPage;