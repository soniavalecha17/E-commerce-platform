import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Wallet, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import API from "../utils/app";

const CheckoutPage = ({ setActiveTab, cart, user, setCart }) => {
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  
  // State for shipping details
  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.username || "",
    address: ""
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
        alert("Razorpay SDK failed to load.");
        setLoading(false);
        return;
      }

      // 1. Create Order (Note: Amount sent as total * 100 for paise)
      const { data } = await API.post("/products/create-online-order", { amount: total });
      const rzpOrder = data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "ArtLink",
        description: "Artisan Product Payment",
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
        modal: { ondismiss: () => setLoading(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay init failed", err);
      alert("Online payment failed to initialize. Try Cash on Delivery.");
      setLoading(false);
    }
  };

  const finalizeOrder = async (payload) => {
    try {
      // Corrected endpoint to match your standard structure
      const response = await API.post("/orders/createorder", payload);
      if (response.data.success || response.status === 201) {
        setCart([]); 
        setStep(3);
      }
    } catch (err) {
      console.error("Order finalization failed", err);
      alert("Order could not be saved.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingDetails.address) return alert("Please enter your address.");
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

    if (paymentMethod === 'cod') {
      await finalizeOrder(payload);
    } else {
      await handleRazorpayPayment(payload);
    }
  };

  if (step === 3) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600">
        <CheckCircle2 size={56} className="animate-bounce" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-8 max-w-sm">Thank you for supporting local artisans!</p>
      <button onClick={() => setActiveTab('shop')} className="bg-[#2D6A4F] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#1B4332] transition-all">
        Return to Marketplace
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => setActiveTab('cart')} className="flex items-center gap-2 text-gray-500 hover:text-[#2D6A4F] font-semibold transition-colors">
          <ArrowLeft size={20} /> Edit Cart
        </button>
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#2D6A4F]' : 'text-gray-300'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-400'}`}>1</span>
            <span className="hidden md:block text-sm font-bold">Shipping</span>
          </div>
          <div className="w-10 h-[2px] bg-gray-200" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#2D6A4F]' : 'text-gray-300'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#2D6A4F] text-white' : 'bg-gray-100 text-gray-400'}`}>2</span>
            <span className="hidden md:block text-sm font-bold">Payment</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Truck className="text-[#2D6A4F]" /> Delivery Details</h2>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={shippingDetails.fullName}
                  onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                  placeholder="Full Name" 
                  className="w-full p-4 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-[#2D6A4F]" 
                />
                <textarea 
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                  placeholder="Flat No, Building, Street Name..." 
                  className="w-full p-4 bg-gray-50 border-none rounded-xl h-32 outline-none focus:ring-2 focus:ring-[#2D6A4F] resize-none" 
                />
              </div>
              <button onClick={() => setStep(2)} className="mt-8 w-full bg-[#2D6A4F] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                Proceed to Payment <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Wallet className="text-[#2D6A4F]" /> Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['upi', 'card', 'cod'].map((id) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${paymentMethod === id ? 'border-[#2D6A4F] bg-[#2D6A4F]/5 text-[#2D6A4F]' : 'border-gray-100 text-gray-400'}`}
                  >
                    {id === 'upi' ? <Wallet /> : id === 'card' ? <CreditCard /> : <Truck />}
                    <span className="font-bold text-xs uppercase">{id}</span>
                  </button>
                ))}
              </div>
              <button onClick={handlePlaceOrder} disabled={loading} className="mt-10 w-full bg-[#2D6A4F] text-white py-5 rounded-2xl font-bold">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : `Pay ₹${total}`}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-24">
          <h3 className="font-bold text-xs text-gray-400 uppercase mb-6">Summary</h3>
          <div className="border-t border-dashed pt-4 space-y-3">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between text-gray-500"><span>Shipping</span><span>₹{shipping}</span></div>
            <div className="flex justify-between text-2xl font-black text-[#2D6A4F] pt-2"><span>Total</span><span>₹{total}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;