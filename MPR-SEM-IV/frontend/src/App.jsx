import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import API from "./utils/app"; 

import CustomerShop from './components/CustomerShop'
import WishlistPage from './components/WishlistPage' 
import CartPage from './components/CartPage' 
import OrdersPage from './components/OrdersPage' 
import ArtisanPage from './components/Artisan/ArtisanPage'
import AdminDashboard from './components/AdminDashboard' 
import LoginPage from './components/Login/LoginPage'
import RegisterPage from './components/RegisterPage' 
import CheckoutPage from './components/CheckoutPage'

function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('login'); 
  const [view, setView] = useState('customer'); 
  const [activeTab, setActiveTab] = useState('shop'); 
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);    

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        if (parsedUser.role === 'admin') {
          setView('admin');
        } else if (parsedUser.role === 'artisan') {
          setView('artisan');
        } else {
          setView('customer');
        }

        fetchInitialData();
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      const [cartRes, wishlistRes] = await Promise.all([
        API.get("/cart/"),
        API.get("/wishlist")
      ]);
      const cartItems = cartRes.data?.data?.items || cartRes.data?.items || [];
      setCart(Array.isArray(cartItems) ? cartItems : []);
      
      // Extract wishlist data array dynamically from common backend wrappers
      const rawWishlist = wishlistRes.data?.data?.items || wishlistRes.data?.data || wishlistRes.data || [];
      setWishlist(Array.isArray(rawWishlist) ? rawWishlist : []);
    } catch (err) {
      console.error("Error fetching initial data:", err);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setAuthView('login'); // Clear admin route bypass on explicit authentication
    
    if (userData.role === 'admin') {
      setView('admin');
    } else if (userData.role === 'artisan') {
      setView('artisan');
    } else {
      setView('customer');
      setActiveTab('shop');
      fetchInitialData(); 
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken"); 
    setAuthView('login');
    setView('customer');
    setActiveTab('shop'); 
  };

  const addToCart = async (product) => {
    if (user?.role === 'artisan' || user?.role === 'admin') {
        alert("Admins and Artisans cannot purchase items!");
        return;
    }
    try {
      await API.post("/cart/add", { productId: product._id });
      const res = await API.get("/cart/");
      const items = res.data?.data?.items || res.data?.items || [];
      setCart(Array.isArray(items) ? items : []);
      alert("Added to cart! 🛒");
    } catch (err) {
      console.error("Cart Error:", err);
      alert(err.response?.data?.message || "Failed to add to cart.");
    }
  };

  const toggleWishlist = async (product) => {
    if (user?.role !== 'customer') return; 
    try {
      const res = await API.post("/wishlist/toggle", { productId: product._id });
      
      // Dynamic resolution check: extract if wrapped in res.data.data.items or res.data.data
      const backendWishlist = res.data?.data?.items || res.data?.data || res.data;
      
      if (res.data?.success && Array.isArray(backendWishlist)) {
        setWishlist(backendWishlist);
      } else {
        // Safe, crash-proof local fallback toggle state mutation
        setWishlist((prev) => {
          const cleanPrev = Array.isArray(prev) ? prev : [];
          const isExisting = cleanPrev.find((item) => {
            if (!item) return false;
            if (typeof item === 'string') return item === product._id;
            return item._id === product._id || item.productId === product._id;
          });

          return isExisting 
            ? cleanPrev.filter((item) => (typeof item === 'string' ? item !== product._id : item._id !== product._id))
            : [...cleanPrev, product];
        });
      }
    } catch (err) {
      console.error("Wishlist Toggle Error:", err);
    }
  };

  // 1. Unauthenticated Global Explicit Route Overrides
  if (authView === 'admin' && !user) {
    return <AdminDashboard user={user} setView={setAuthView} onLogout={handleLogout} />;
  }

  // 2. Fallback to Authentication Gateways if context state is missing
  if (!user) {
    return authView === 'login' ? (
      <LoginPage onLoginSuccess={handleLoginSuccess} setView={setAuthView} />
    ) : (
      <RegisterPage setView={setAuthView} />
    );
  }

  // 3. Authenticated Structural Rendering Tree
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Logout Trigger */}
      <button 
        onClick={handleLogout}
        className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-2 rounded-full shadow-2xl z-[9999] font-bold hover:bg-red-700 transition-all text-[10px] uppercase tracking-wider"
      >
        Logout
      </button>

      {/* Primary Role Switches */}
      {user.role === 'admin' ? (
        <AdminDashboard user={user} setView={setAuthView} onLogout={handleLogout} />
      ) : user.role === 'artisan' ? (
        <ArtisanPage setView={setView} user={user} onLogout={handleLogout} />
      ) : (
        /* Customer Portal Component Branches */
        <>
          {activeTab === 'shop' && (
            <CustomerShop 
              user={user} onLogout={handleLogout} setView={setView} view={view}
              setActiveTab={setActiveTab} cart={cart} setCart={setCart}
              addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist}
            />
          )}
          {activeTab === 'wishlist' && (
            <WishlistPage setView={setView} setActiveTab={setActiveTab} wishlist={wishlist} setWishlist={setWishlist} setCart={setCart} addToCart={addToCart} />
          )}
          {activeTab === 'cart' && (
            <CartPage view={view} setView={setView} setActiveTab={setActiveTab} cart={cart} setCart={setCart} />
          )}
          {activeTab === 'checkout' && (
            <CheckoutPage setActiveTab={setActiveTab} cart={cart} setCart={setCart} user={user} />
          )}
          {activeTab === 'orders' && (
            <OrdersPage setView={setView} setActiveTab={setActiveTab} />
          )}
        </>
      )}
      
      {/* Nested Route Outlets */}
      <Outlet context={{ cart, addToCart, view, user }} />
    </div>
  )
}

export default App;