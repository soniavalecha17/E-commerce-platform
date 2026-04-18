import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Heart, ChevronDown, ArrowLeft, Loader2 } from 'lucide-react';
import API from "../utils/app";

const WishlistPage = ({ setView, setActiveTab, wishlist, setWishlist, setCart }) => {
  const [loading, setLoading] = useState(false);

  // 1. Fetch Wishlist on mount to stay in sync with database
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await API.get("/wishlist"); // Adjust endpoint to match your backend
      setWishlist(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if wishlist is empty or you want to ensure it's fresh
    if (!wishlist || wishlist.length === 0) {
      fetchWishlist();
    }
  }, []);

  // 2. Add to Cart with proper feedback
  const handleAddToCart = async (product) => {
    try {
      const response = await API.post("/cart/add", { productId: product._id });
      if (response.data.success || response.status === 200) {
        alert(`${product.name} added to cart! 🛒`);
        
        // Refresh global cart state
        const cartRes = await API.get("/cart/");
        setCart(cartRes.data?.data?.items || []);
      }
    } catch (err) {
      console.error("Cart error:", err);
      alert("Could not add to cart. Please check your login.");
    }
  };

  // 3. Remove from Wishlist
  const handleRemove = async (product) => {
    try {
      // Hits the toggle endpoint to remove
      await API.post(`/wishlist/toggle`, { productId: product._id });
      
      // Update local state immediately for a fast UI feel
      setWishlist(prev => prev.filter(item => item._id !== product._id));
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
      alert("Failed to remove item.");
    }
  };

  if (loading && (!wishlist || wishlist.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#2D6A4F]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 border-b bg-white sticky top-0 z-50">
        <button 
          onClick={() => setActiveTab('shop')} 
          className="flex items-center gap-2 text-gray-600 hover:text-[#2D6A4F] font-semibold transition-colors"
        >
          <ArrowLeft size={20} /> Back to Shop
        </button>
        
        <div className="flex items-center gap-6">
           <button onClick={() => setActiveTab('cart')} className="text-gray-500 hover:text-[#2D6A4F] font-medium transition-colors">Cart</button>
           <div className="relative">
            <select 
              value="customer"
              onChange={(e) => setView(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none cursor-pointer hover:border-[#2D6A4F] transition-all"
            >
              <option value="customer">Customer View</option>
              <option value="artisan">Artisan View</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-[#2D6A4F]/10 p-3 rounded-2xl">
              <Heart className="text-[#2D6A4F] fill-[#2D6A4F]" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Wishlist</h2>
              <p className="text-gray-500 font-medium">{wishlist?.length || 0} items saved for later</p>
            </div>
          </div>
        </div>

        {(!wishlist || wishlist.length === 0) ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-gray-200" />
            </div>
            <p className="text-gray-500 text-xl font-medium mb-8">Your wishlist is currently empty.</p>
            <button 
              onClick={() => setActiveTab('shop')} 
              className="bg-[#2D6A4F] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#1B4332] transition-all shadow-lg shadow-[#2D6A4F]/20"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map(product => (
              <div key={product._id} className="group bg-white rounded-3xl p-4 border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square bg-gray-50">
                  <img 
                    src={product.productImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={() => handleRemove(product)} 
                      className="bg-white/90 backdrop-blur-sm p-2.5 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="px-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{product.name}</h3>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
                    {product.category || "Handcrafted"}
                  </p>
                  <div className="flex items-baseline gap-2 mb-5">
                    <span className="text-[#2D6A4F] font-black text-2xl">₹{product.price}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-[#2D6A4F] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1B4332] active:scale-95 transition-all shadow-md shadow-[#2D6A4F]/10"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;