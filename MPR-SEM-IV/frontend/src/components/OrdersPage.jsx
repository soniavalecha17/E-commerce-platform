import React, { useEffect, useState } from 'react';
import { Package, Clock, ArrowLeft, Loader2, ShoppingBag } from 'lucide-react';
import API from "../utils/app";

const OrdersPage = ({ setActiveTab }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      // Your backend route is getOrders, ensure the URL matches your router
      const res = await API.get("/orders/getorders"); 
      // Your ApiResponse class wraps data in a 'data' field
      const data = res.data?.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700';
      case 'PENDING': return 'bg-orange-100 text-orange-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#2D6A4F]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <button 
          onClick={() => setActiveTab('shop')} 
          className="flex items-center gap-2 text-gray-600 hover:text-[#2D6A4F] font-semibold transition-colors"
        >
          <ArrowLeft size={20} /> Back to Shop
        </button>
        <h1 className="font-bold text-gray-900">Purchase History</h1>
        <div className="w-20" />
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Package className="text-[#2D6A4F]" size={32} />
          <h2 className="text-3xl font-black text-gray-900">My Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-gray-200" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-8">Start supporting local artisans today!</p>
            <button 
              onClick={() => setActiveTab('shop')}
              className="bg-[#2D6A4F] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1B4332] transition-all"
            >
              Explore Marketplace
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gray-50/50 px-8 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                      <p className="font-mono text-sm font-bold text-gray-700">#{order._id?.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                      <p className="text-sm font-bold text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                    {order.status || 'PENDING'}
                  </div>
                </div>

                <div className="p-8">
                  <div className="space-y-6">
                    {order.orderItems?.map((item, idx) => {
                      // FIXED: Backend populates 'productId', not 'product'
                      const productInfo = item.productId || {}; 
                      return (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                            {/* FIXED: Backend uses 'mainImage' based on your populate call */}
                            <img 
                              src={productInfo.mainImage || "/placeholder.png"} 
                              className="w-full h-full object-cover" 
                              alt={productInfo.name}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 leading-tight">{productInfo.name || "Product"}</h4>
                            <p className="text-gray-400 text-xs">Quantity: {item.quantity}</p>
                          </div>
                          {/* Use the price from the populated product object */}
                          <p className="font-black text-gray-900">₹{(productInfo.price || 0) * item.quantity}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t border-dashed border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={16} />
                      <span className="text-xs font-medium">Estimated Delivery: 5-7 Days</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase">Total Paid</p>
                      {/* FIXED: Backend uses 'orderPrice' key */}
                      <p className="text-2xl font-black text-[#2D6A4F]">₹{order.orderPrice || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;