import React, { useEffect, useState } from 'react';
import { Trash2, ChevronDown, ArrowLeft, Loader2, ShoppingBag, MapPin, CreditCard, Package, CheckCircle2 } from 'lucide-react';
import API from "../utils/app";

const CartPage = ({ setView, setActiveTab, cart, setCart }) => {
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [step, setStep] = useState('cart'); // Toggle between 'cart' and 'checkout'
  
  // Checkout Form State
  const [address, setAddress] = useState("Default Delivery Address, Mumbai, Maharashtra");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart/");
      const items = res.data?.data?.items || res.data?.items || [];
      setCart(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, action) => {
    if (!productId) return;
    try {
      const endpoint = action === 'increase' ? "/cart/add" : "/cart/decrease";
      await API.post(endpoint, { productId });
      await fetchCart(); 
    } catch (err) {
      console.error("Update quantity failed", err);
    }
  };

  const removeItem = async (productId) => {
    if (!productId) return;
    try {
      await API.post("/cart/remove", { productId });
      await fetchCart();
    } catch (err) {
      console.error("Remove item failed", err);
    }
  };

  const handleFinalCheckout = async () => {
    if (!cart || cart.length === 0) return;

    try {
        setIsPlacingOrder(true);
        
        const orderItems = cart.map(item => {
            // Check every possible location for the ID
            const id = item.productId?._id || item.product?._id || item.productId || item.product;
            
            if (!id) console.error("Found an item with no ID:", item);

            return {
                productId: id,
                quantity: item.quantity
            };
        }).filter(item => item.productId); // Remove any nulls before sending

        if (orderItems.length === 0) {
            alert("Error: Some items in your cart are invalid.");
            return;
        }

        const orderData = { orderItems, address, paymentMethod };

        const res = await API.post("/orders/createorder", orderData, {
            withCredentials: true 
        });

      if (res.status === 201 || res.data.success) {
        setCart([]); 
        setStep('success');
        setTimeout(() => {
            setActiveTab('orders'); // Redirect to orders after 2 seconds
        }, 2000);
      }
    } catch (err) {
      console.error("Order Placement Failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const total = (cart || []).reduce((acc, item) => {
    const product = item.productId || item.product || {};
    return acc + ((product.price || 0) * item.quantity);
  }, 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#2D6A4F]" size={40} />
    </div>
  );

  // --- VIEW: SUCCESS ANIMATION ---
  if (step === 'success') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
        <div className="bg-green-50 p-6 rounded-full mb-6">
            <CheckCircle2 size={80} className="text-[#2D6A4F] animate-bounce" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-500 text-center max-w-xs">Your handcrafted items are being prepared. Redirecting to your orders...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="flex items-center justify-between px-8 py-4 border-b bg-white sticky top-0 z-50">
        <button 
          onClick={() => step === 'checkout' ? setStep('cart') : setActiveTab('shop')} 
          className="flex items-center gap-2 text-gray-600 hover:text-[#2D6A4F] font-semibold transition-colors"
        >
          <ArrowLeft size={20} /> {step === 'checkout' ? "Back to Cart" : "Back to Shop"}
        </button>
        
        <div className="flex items-center gap-4">
           <span className={`text-sm font-bold ${step === 'cart' ? 'text-[#2D6A4F]' : 'text-gray-400'}`}>Cart</span>
           <div className="w-10 h-[2px] bg-gray-200" />
           <span className={`text-sm font-bold ${step === 'checkout' ? 'text-[#2D6A4F]' : 'text-gray-400'}`}>Checkout</span>
        </div>

        <div className="w-32" /> {/* Spacer for symmetry */}
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Items or Checkout Form */}
        <div className="lg:col-span-2">
          {step === 'cart' ? (
            <>
              <div className="flex items-center gap-3 mb-8">
                  <ShoppingBag className="text-[#2D6A4F]" size={32} />
                  <h2 className="text-3xl font-black text-gray-900">Your Cart</h2>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-gray-500 text-lg">Your cart is empty.</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 space-y-4">
                    {cart.map(item => {
                      const product = item.productId || item.product || {};
                      return (
                        <div key={item._id} className="flex items-center gap-4 py-4 border-b last:border-0 border-gray-50">
                          <img src={product.mainImage || "/placeholder.png"} className="w-20 h-20 rounded-xl object-cover border" alt="" />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{product.name}</h4>
                            <p className="text-[#2D6A4F] font-bold">₹{product.price} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg">
                            <button onClick={() => updateQuantity(product._id, 'decrease')} className="px-2 font-bold">-</button>
                            <span className="font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(product._id, 'increase')} className="px-2 font-bold">+</button>
                          </div>
                          <button onClick={() => removeItem(product._id)} className="text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-8">
                  <MapPin className="text-[#2D6A4F]" size={32} />
                  <h2 className="text-3xl font-black text-gray-900">Shipping Details</h2>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address</label>
                      <textarea 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-[#2D6A4F] outline-none min-h-[120px]"
                        placeholder="Enter your full address..."
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-4">Payment Method</label>
                      <div className="grid grid-cols-2 gap-4">
                          <button 
                            onClick={() => setPaymentMethod('COD')}
                            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'COD' ? 'border-[#2D6A4F] bg-[#2D6A4F]/5' : 'border-gray-100'}`}
                          >
                              <Package size={24} className={paymentMethod === 'COD' ? 'text-[#2D6A4F]' : 'text-gray-400'}/>
                              <span className="font-bold text-sm">Cash on Delivery</span>
                          </button>
                          <button 
                            disabled
                            className="p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 flex flex-col items-center gap-2 opacity-50 cursor-not-allowed"
                          >
                              <CreditCard size={24} className="text-gray-400"/>
                              <span className="font-bold text-sm">Online (Soon)</span>
                          </button>
                      </div>
                  </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT COLUMN: Order Summary (Sticky) */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-28">
                <h3 className="text-xl font-black mb-6">Order Summary</h3>
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Shipping</span>
                        <span className="text-green-600 font-bold">FREE</span>
                    </div>
                    <div className="h-[1px] bg-gray-100 my-4" />
                    <div className="flex justify-between items-end">
                        <span className="font-bold text-gray-900">Total Payable</span>
                        <span className="text-3xl font-black text-[#2D6A4F]">₹{total}</span>
                    </div>
                </div>

                {step === 'cart' ? (
                    <button 
                        onClick={() => setStep('checkout')}
                        disabled={cart.length === 0}
                        className="w-full bg-[#2D6A4F] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#1B4332] transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
                    >
                        Proceed to Checkout <ArrowLeft size={20} className="rotate-180" />
                    </button>
                ) : (
                    <button 
                        onClick={handleFinalCheckout}
                        disabled={isPlacingOrder}
                        className="w-full bg-[#2D6A4F] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#1B4332] transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-70"
                    >
                        {isPlacingOrder ? <Loader2 className="animate-spin" /> : <Package size={22} />}
                        Confirm & Place Order
                    </button>
                )}
                
                <p className="text-center text-xs text-gray-400 mt-6 px-4">
                    By placing an order, you agree to our terms of service and handcrafted quality guarantee.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;