
import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Wallet, CheckCircle2, Loader2 } from 'lucide-react';
import API from "../utils/app";

const CheckoutPage = ({ setActiveTab, cart, user, setCart }) => {
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  
  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.username || "",
    address: "Default Delivery Address, Mumbai, Maharashtra" 
  });

  const subtotal = (cart || []).reduce((acc, item) => {
    const productData = item.productId || item.product;
    return acc + ((productData?.price || 0) * item.quantity);
  }, 0);

  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const handleRazorpayPayment = async (orderPayload) => {
    try {
      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load. Please verify index.html script tag.");
        setLoading(false);
        return;
      }

      const { data } = await API.post("/products/create-online-order", { amount: total });
      const rzpOrder = data.data || data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "ArtLink",
        description: "Artisan Product Purchase Secure Checkout",
        order_id: rzpOrder.id,
        handler: async function (response) {
          await finalizeOrder({ 
            ...orderPayload, 
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            paymentStatus: "Paid" 
          });
        },
        prefill: {
          name: shippingDetails.fullName,
          email: user?.email || "",
        },
        theme: { color: "#2D6A4F" },
        modal: { 
          ondismiss: () => { setLoading(false); } 
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay initiation error:", err);
      alert("Online portal initialization failed. Please choose Cash on Delivery.");
      setLoading(false);
    }
  };

  // Update this in your CheckoutPage.jsx
const finalizeOrder = async (payload) => {
  try {
    // Add ?t=${Date.now()} to the URL to bypass the 304 cache
    console.log("DEBUG: Final Payload is:", JSON.stringify(payload));
    const response = await API.post(`/orders/createorder?t=${Date.now()}`, payload);
    
    if (response.data.success || response.status === 201 || response.status === 200) {
      setCart([]);
      setStep(3);
    }
  } catch (err) {
    console.error("Order finalization error:", err);
    // Log the full response so you can see the actual error
    if (err.response) {
      console.error("Server Error Details:", err.response.data);
    }
    alert("Transaction processed but order creation failed.");
  } finally {
    setLoading(false);
  }
};

  const handlePlaceOrder = async () => {
    if (!shippingDetails.address.trim()) return alert("Please enter a valid shipping destination.");
    setLoading(true);
    
    const payload = {
      orderItems: cart.map(item => ({
        productId: item.productId?._id || item.product?._id,
        quantity: item.quantity
      })),
      address: shippingDetails.address,
      fullName: shippingDetails.fullName,
      paymentMethod: paymentMethod.toUpperCase()
    };

    console.log("DEBUG: Final Payload Object:", payload); 
    if (!payload.orderItems || payload.orderItems.length === 0) {
        alert("Cart is empty! Cannot proceed.");
        return;
    }// DEBUG: Check if data is correct

    try {
      if (paymentMethod === 'cod') {
        await finalizeOrder({ ...payload, paymentStatus: "Pending" });
      } else {
        await handleRazorpayPayment(payload);
      }
    } catch (error) {
      console.error("--- FULL ERROR FROM FRONTEND ---");
      // This will show exactly why the request failed (e.g., 401 Unauthorized, 404 Not Found)
      if (error.response) {
        console.error("Data:", error.response.data);
        console.error("Status:", error.response.status);
        alert(`Checkout failed: ${error.response.data.message || "Server Error"}`);
      } else {
        console.error("Message:", error.message);
        alert("Checkout failed: Could not reach the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800">
      {/* Top Navbar */}
      <nav className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => setActiveTab('cart')} className="flex items-center gap-2 text-gray-500 hover:text-[#2D6A4F] font-semibold transition-colors">
          <ArrowLeft size={20} /> Back to Cart
        </button>
        <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
          <span>Cart</span> <div className="w-6 h-[1px] bg-gray-300"></div> <span className="text-[#2D6A4F]">Checkout</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Side Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address Container */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="text-[#2D6A4F]" size={24} />
              <h2 className="text-2xl font-black tracking-tight">Shipping Details</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Delivery Address</label>
                <textarea 
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                  placeholder="Enter complete shipping address..." 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl h-28 outline-none focus:ring-2 focus:ring-[#2D6A4F] resize-none font-medium text-sm" 
                />
              </div>
            </div>
          </div>

          {/* Payment Method Container */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Payment Method</h3>
            
            {/* Pure Tailwind Row Layout Grid */}
            <div className="grid grid-cols-3 gap-4 w-full">
              
              {/* Online UPI Option Button */}
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'upi' 
                    ? 'border-[#2D6A4F] bg-green-50/30 text-[#2D6A4F]' 
                    : 'border-gray-100 bg-white text-gray-400'
                }`}
              >
                <Wallet size={24} className={paymentMethod === 'upi' ? 'text-[#2D6A4F]' : 'text-gray-400'} />
                <span className="font-bold text-sm text-center whitespace-nowrap">Online UPI</span>
              </button>

              {/* Cards Option Button */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'card' 
                    ? 'border-[#2D6A4F] bg-green-50/30 text-[#2D6A4F]' 
                    : 'border-gray-100 bg-white text-gray-400'
                }`}
              >
                <CreditCard size={24} className={paymentMethod === 'card' ? 'text-[#2D6A4F]' : 'text-gray-400'} />
                <span className="font-bold text-sm text-center whitespace-nowrap">Cards</span>
              </button>

              {/* Cash on Delivery Option Button */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'cod' 
                    ? 'border-[#2D6A4F] bg-green-50/30 text-[#2D6A4F]' 
                    : 'border-gray-100 bg-white text-gray-400'
                }`}
              >
                <Truck size={24} className={paymentMethod === 'cod' ? 'text-[#2D6A4F]' : 'text-gray-400'} />
                <span className="font-bold text-sm text-center whitespace-nowrap">Cash on Delivery</span>
              </button>

            </div>
          </div>
        </div>

        {/* Right Sticky Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-24">
          <h3 className="font-bold text-xs text-gray-400 uppercase mb-6">Order Summary</h3>
          <div className="border-t border-dashed pt-4 space-y-3">
            <div className="flex justify-between text-gray-500 text-sm font-medium"><span>Items Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between text-gray-500 text-sm font-medium"><span>Shipping Fee</span><span>{shipping === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${shipping}`}</span></div>
            <div className="flex justify-between text-2xl font-black text-[#2D6A4F] pt-4 border-t border-gray-100 mt-2"><span>Total Amount</span><span>₹{total}</span></div>
          </div>
          
          <button 
            onClick={handlePlaceOrder} 
            disabled={loading} 
            className="mt-8 w-full bg-[#2D6A4F] text-white py-4 rounded-2xl font-bold shadow-md hover:bg-[#1B4332] flex items-center justify-center transition-all disabled:opacity-50 text-base"
          >
            {loading ? <Loader2 className="animate-spin" /> : paymentMethod === 'cod' ? 'Confirm Order' : `Pay Securely ₹${total}`}
          </button>

          <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <ShieldCheck size={16} className="text-green-600 shrink-0" />
            <span>Secure transactions powered by Razorpay.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;