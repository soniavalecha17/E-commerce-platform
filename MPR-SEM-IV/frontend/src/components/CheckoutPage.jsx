import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Wallet, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import API from "../utils/app";

const CheckoutPage = ({ setActiveTab, cart, user, setCart }) => {
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // SAFE CALCULATION: Checks both possible key names for product data
  const subtotal = (cart || []).reduce((acc, item) => {
    const productData = item.productId || item.product;
    const price = productData?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  // Inside CheckoutPage.jsx - Update the handlePlaceOrder function
const handlePlaceOrder = async () => {
  setLoading(true);
  try {
    // FORMATTING DATA FOR YOUR BACKEND:
    // Your controller expects: { orderItems: [{ productId, quantity }], address }
    const payload = {
      orderItems: cart.map(item => ({
        productId: item.productId?._id || item.product?._id,
        quantity: item.quantity
      })),
      address: "Default User Address" // Replace with state from your address form
    };

    // Note: Your controller is exported as createOrder, 
    // ensure your route is likely API.post("/orders", payload)
    const response = await API.post("/orders", payload);

    if (response.data.success) {
      setCart([]); // Clear cart on success
      setStep(3);
    }
  } catch (err) {
    console.error("Order failed", err);
    alert(err.response?.data?.message || "Payment failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  // SUCCESS VIEW
  if (step === 3) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600 animate-pulse">
          <CheckCircle2 size={56} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          Your support means the world to our artisans. We'll notify you once your treasures are shipped.
        </p>
        <button 
          onClick={() => setActiveTab('shop')}
          className="bg-[#2D6A4F] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#1B4332] transition-all shadow-lg shadow-[#2D6A4F]/20"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <nav className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => setActiveTab('cart')} className="flex items-center gap-2 text-gray-500 hover:text-[#2D6A4F] font-semibold transition-colors">
          <ArrowLeft size={20} /> Edit Cart
        </button>
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#2D6A4F]' : 'text-gray-300'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-400'}`}>1</span>
            <span className="hidden md:block text-sm font-bold">Shipping</span>
          </div>
          <div className="w-10 h-[2px] bg-gray-100" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#2D6A4F]' : 'text-gray-300'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-400'}`}>2</span>
            <span className="hidden md:block text-sm font-bold">Payment</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Truck className="text-[#2D6A4F]" /> Delivery Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Full Delivery Name</label>
                  <input type="text" placeholder="John Doe" className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Contact Number</label>
                  <input type="text" placeholder="+91 XXXXX XXXXX" className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">PIN Code</label>
                  <input type="text" placeholder="400001" className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Complete Address</label>
                  <textarea placeholder="Flat No, Building, Street Name..." className="w-full p-4 bg-gray-50 border-none rounded-xl h-32 outline-none focus:ring-2 focus:ring-[#2D6A4F] transition-all resize-none" />
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                className="mt-8 w-full bg-[#2D6A4F] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1B4332] shadow-lg shadow-[#2D6A4F]/20 transition-all active:scale-[0.98]"
              >
                Proceed to Payment <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Wallet className="text-[#2D6A4F]" /> Payment Method
              </h2>
              
              <div className="space-y-4">
                {[
                  { id: 'upi', name: 'UPI (GPay / PhonePe)', icon: <Wallet className="text-blue-500" /> },
                  { id: 'card', name: 'Credit / Debit Card', icon: <CreditCard className="text-purple-500" /> },
                  { id: 'cod', name: 'Cash on Delivery', icon: <Truck className="text-orange-500" /> }
                ].map((method) => (
                  <label key={method.id} className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === method.id ? 'border-[#2D6A4F] bg-[#2D6A4F]/5' : 'border-gray-50 hover:border-gray-200'}`}>
                    <div className="flex items-center gap-4">
                      {method.icon}
                      <span className={`font-bold ${paymentMethod === method.id ? 'text-[#2D6A4F]' : 'text-gray-600'}`}>{method.name}</span>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="w-5 h-5 accent-[#2D6A4F]" 
                    />
                  </label>
                ))}
              </div>

              <div className="mt-8 p-5 bg-green-50 rounded-2xl flex items-start gap-4">
                <ShieldCheck className="text-green-600 shrink-0" size={24} />
                <p className="text-xs text-green-800 leading-relaxed font-medium">
                  Secure Checkout: Your payment is protected. We hold the funds in escrow and only release them to the artisan after you receive your handcrafted items.
                </p>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-8 w-full bg-[#2D6A4F] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1B4332] disabled:opacity-50 shadow-lg shadow-[#2D6A4F]/20 transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" /> : `Complete Purchase • ₹${total}`}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-lg mb-6 text-gray-900 uppercase tracking-wider text-sm">Order Summary</h3>
            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2">
              {cart.map(item => {
                const product = item.productId || item.product;
                return (
                  <div key={item._id || product?._id} className="flex justify-between items-start text-sm">
                    <div className="flex-1 pr-4">
                      <p className="font-bold text-gray-800 leading-tight mb-1">{product?.name || "Handcrafted Item"}</p>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-gray-900">₹{(product?.price || 0) * item.quantity}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-dashed pt-6 space-y-3">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Shipping</span>
                <span className="text-green-600">₹{shipping}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-[#2D6A4F] pt-4">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;