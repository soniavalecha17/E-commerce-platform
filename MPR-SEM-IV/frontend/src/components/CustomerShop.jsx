import React, { useState, useEffect } from 'react';
import { ShoppingBag, ShoppingCart, Search, Heart, Star, LogOut, X, MessageSquare } from 'lucide-react';
import API from "../utils/app";
import ProductReviews from "./Artisan/ProductReviews.jsx"; 
import axios from 'axios';

const CustomerShop = ({view, setView, setActiveTab, wishlist, toggleWishlist, cart, setCart, onLogout, user }) => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State management for opening detail modal panel views
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeReviews, setActiveReviews] = useState([]);

  const categories = ['All', 'Textiles', 'Pottery', 'Leather', 'Woodwork', 'Jewelry', 'Home Decor'];

  useEffect(() => {
    API.get("/products/getproducts")
      .then((res) => {
        setProducts(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // Helper to open product detail and fetch reviews from MongoDB
  const handleOpenProduct = async (product) => {
    setSelectedProduct(product);
    try {
      const response = await API.get(`/reviews/product/${product._id}`);
      setActiveReviews(response.data || []);
    } catch (err) {
      console.error("Error fetching product reviews:", err);
      setActiveReviews([]);
    }
  };

  // Submit review handler tied to backend API endpoint
  const handleAddNewReview = async (formData) => {
    try {
      const payload = {
        productId: selectedProduct._id,
        customer_name: formData.customer_name,
        rating: formData.rating,
        review_text: formData.review_text
      };

      const response = await API.post('/reviews/add', payload);
      
      // Update UI state locally
      setActiveReviews(prev => [response.data, ...prev]);
      alert("Review posted successfully! ⭐");
    } catch (err) {
      console.error(err);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await API.post("/cart/add", { productId: product._id });
      if (response.data.success) {
        alert("Added to cart! 🛒");
        const cartRes = await API.get("/cart/");
        setCart(cartRes.data.data.items || []);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add to cart.");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = filter === "All" || p.category?.toLowerCase() === filter.toLowerCase();
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.owner?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleExplore = () => {
    document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cartCount = (cart || []).reduce((acc, item) => acc + (item.quantity || 1), 0);
  const safeWishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

  return (
    <div className="min-h-screen bg-white relative">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="flex items-center gap-10">
          <h1 className="text-2xl font-bold text-[#2D6A4F] tracking-tight">ArtLink</h1>
          <div className="flex items-center gap-8">
            <button onClick={() => setActiveTab('shop')} className="flex items-center gap-2 text-[#2D6A4F] font-semibold border-b-2 border-[#2D6A4F] pb-1">
              <ShoppingBag size={20} /> Shop
            </button>
            <button onClick={() => setActiveTab('orders')} className="flex items-center gap-2 text-gray-500 hover:text-[#2D6A4F] transition-colors">
              <ShoppingCart size={20} /> Orders
            </button>
            <button onClick={() => setActiveTab('wishlist')} className="flex items-center gap-2 text-gray-500 hover:text-[#2D6A4F] transition-colors relative">
              <Heart size={20} /> Wishlist
              {safeWishlistCount > 0 && <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">{safeWishlistCount}</span>}
            </button>
            <button onClick={() => setActiveTab('cart')} className="flex items-center gap-2 text-gray-500 hover:text-[#2D6A4F] transition-colors relative">
              <ShoppingCart size={20} /> Cart
              {cartCount > 0 && <span className="absolute -top-1 -right-2 bg-[#2D6A4F] text-white text-[10px] font-bold px-1.5 rounded-full animate-bounce">{cartCount}</span>}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{user?.username || "Guest"}</p>
              <p className="text-xs text-gray-500 capitalize">{view}</p>
            </div>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "Guest"}`} alt="Avatar" className="w-10 h-10 rounded-full bg-purple-100" />
            <button onClick={onLogout} className="text-gray-400 hover:text-red-500 ml-2 transition-colors"><LogOut size={18} /></button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="px-8 py-6">
        <section className="relative h-[450px] rounded-3xl flex items-center justify-center text-white overflow-hidden shadow-2xl" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1551893478-d726eaf0442c?q=80&w=1600')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="relative z-10 text-center px-4">
            <h1 className="text-6xl font-bold mb-6 tracking-tight">Handcrafted with Soul</h1>
            <p className="text-xl opacity-95 mb-10 max-w-2xl mx-auto font-medium">Discover unique, handmade treasures direct from rural artisans.</p>
            <button onClick={handleExplore} className="bg-white text-[#2D6A4F] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all active:scale-95">Explore Collection</button>
          </div>
        </section>
      </div>

      {/* FILTER & SEARCH */}
      <div id="shop-section" className="max-w-7xl mx-auto px-8 py-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products or artisans..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#2D6A4F] outline-none shadow-sm transition-all" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${filter === cat ? 'bg-[#2D6A4F] text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{cat}</button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="flex justify-center items-center h-64 text-[#2D6A4F] font-bold">
            <div className="animate-pulse">Loading unique treasures...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map(product => {
              const isWishlisted = Array.isArray(wishlist) ? wishlist.some(item => item && (typeof item === 'string' ? item === product._id : item._id === product._id)) : false;

              return (
                <div 
                  key={product._id} 
                  onClick={() => handleOpenProduct(product)} 
                  className="group border border-transparent hover:border-gray-100 rounded-3xl p-2 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 mb-4 shadow-sm">
                      <img src={product.productImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          toggleWishlist(product);
                        }}
                        className="absolute top-5 right-5 p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm hover:scale-110 transition-all hover:bg-white"
                      >
                        <Heart size={20} className={`transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                      </button>
                    </div>

                    <div className="flex justify-between items-start px-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-1 font-medium">by {product.owner?.username || "Artisan"}</p>
                      </div>
                    </div>

                    {/* Ratings Option Action Label Link */}
                    <div className="px-2 mb-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProduct(product);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6A4F] hover:text-[#1B4332] hover:underline transition-all bg-emerald-50 px-2.5 py-1 rounded-lg"
                      >
                        <MessageSquare size={13} className="fill-current" />
                        View Reviews & Ratings
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto px-2 pb-2">
                    <span className="text-2xl font-black text-[#2D6A4F]">₹{product.price}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleAddToCart(product);
                      }} 
                      className="bg-[#2D6A4F] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1B4332] transition-all flex items-center gap-2 active:scale-95 shadow-sm"
                    >
                      <ShoppingCart size={18} /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* POPUP DETAIL & REVIEWS MODAL OVERLAY CARD */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 md:p-8 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Product Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b border-gray-100 pb-8">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50">
                <img src={selectedProduct.productImage} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-[#2D6A4F] bg-[#2D6A4F]/10 px-3 py-1 rounded-full">{selectedProduct.category}</span>
                  <h2 className="text-3xl font-black text-gray-900 mt-2 mb-1">{selectedProduct.name}</h2>
                  <p className="text-sm text-gray-500 font-medium mb-4">Crafted with care by {selectedProduct.owner?.username || "Artisan"}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedProduct.description || "This beautiful handcrafted product is made entirely from natural and sustainable materials by our regional rural artisans."}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-3xl font-black text-[#2D6A4F]">₹{selectedProduct.price}</span>
                  <button 
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="bg-[#2D6A4F] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1B4332] flex items-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <ShoppingCart size={20} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Review Section Component */}
            <ProductReviews existingReviews={activeReviews} onAddReview={handleAddNewReview} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerShop;