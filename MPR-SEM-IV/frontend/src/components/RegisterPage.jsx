import React, { useState } from 'react';
import { User, Mail, Lock, Loader2, ArrowRight, Store, UserCircle, Upload, FileCheck } from 'lucide-react';
import API from "../utils/app";

const RegisterPage = ({ setView }) => {
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        role: 'customer' 
    });
    const [idProof, setIdProof] = useState(null); // New state for the file
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check if Artisan has selected a file
        if (formData.role === 'artisan' && !idProof) {
            alert("Artisans must upload an ID proof for verification.");
            setLoading(false);
            return;
        }

        try {
            // CRITICAL: Use FormData for file uploads
            const data = new FormData();
            data.append("username", formData.username);
            data.append("email", formData.email);
            data.append("password", formData.password);
            data.append("role", formData.role);
            
            if (formData.role === 'artisan' && idProof) {
                data.append("idProof", idProof); // Ensure key name matches backend Multer config
            }

            const response = await API.post("/users/registeruser", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.success) {
                alert(`Registered successfully as ${formData.role}! Please wait for admin verification.`);
                setView('login');
            }
        } catch (err) {
            console.error("Registration Error:", err.response?.data);
            alert(err.response?.data?.message || "Registration failed. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-gray-900">Join ArtLink</h2>
                    <p className="text-gray-500 mt-2">Connecting rural craft to global hearts</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Role Selection */}
                    <div className="flex gap-4 mb-4">
                        {[
                            { id: 'customer', label: 'Customer', icon: UserCircle },
                            { id: 'artisan', label: 'Artisan', icon: Store }
                        ].map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => {
                                    setFormData({ ...formData, role: r.id });
                                    if (r.id === 'customer') setIdProof(null); // Clear file if switching back
                                }}
                                className={`flex-1 py-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                                    formData.role === r.id 
                                    ? 'bg-[#0d9488]/10 border-[#0d9488] text-[#0d9488]' 
                                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                <r.icon size={20} />
                                <span className="text-xs font-black uppercase tracking-wider">{r.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Standard Inputs */}
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" placeholder="Full Name / Workshop Name" required
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0d9488] outline-none"
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>
                    
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="email" placeholder="Email Address" required
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0d9488] outline-none"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="password" placeholder="Password" required
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#0d9488] outline-none"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    {/* 📂 ID Proof Upload - Only visible for Artisans */}
                    {formData.role === 'artisan' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Identity Verification (Required)</label>
                            <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50 hover:border-[#0d9488] transition-colors group">
                                <input 
                                    type="file" 
                                    accept="image/*,.pdf"
                                    required={formData.role === 'artisan'}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => setIdProof(e.target.files[0])}
                                />
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-xl ${idProof ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400'}`}>
                                        {idProof ? <FileCheck size={20} /> : <Upload size={20} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">
                                            {idProof ? idProof.name : "Upload Government ID"}
                                        </p>
                                        <p className="text-[10px] text-gray-400 uppercase">JPG, PNG or PDF (Max 5MB)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit" disabled={loading}
                        className="w-full bg-[#0d9488] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#0b7a6f] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Create {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} Account <ArrowRight size={20} /></>}
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-600">
                    Already part of the community? 
                    <button onClick={() => setView('login')} className="text-[#0d9488] font-bold ml-2 hover:underline">Login</button>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;