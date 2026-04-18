import React, { useEffect, useState } from "react";
import { Plus, Package, ArrowRight } from "lucide-react"; // Added icons for a premium look
import API from "../../utils/app";

export default function ProductsPage({ setActiveTab }) { // Pass setActiveTab as a prop
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const response = await API.get("/products/my-products");
        const actualProducts = response.data.data; 
        setProducts(Array.isArray(actualProducts) ? actualProducts : []);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyItems();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-[#0d9488] font-bold animate-pulse">
      Checking your workshop...
    </div>
  );

  return (
    <div className="space-y-8">
      {/* HEADER SECTION WITH BUTTON */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Your Workshop</h2>
          <p className="text-gray-500 font-medium">Manage your handcrafted products and inventory.</p>
        </div>
        
        <button 
          onClick={() => setActiveTab('add-product')} // Directs to the add product view
          className="bg-[#0d9488] text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-[#0b7a6f] transition-all shadow-lg shadow-teal-900/20 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          List New Product
        </button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length > 0 ? (
          products.map((item) => (
            <div key={item._id} className="group p-4 bg-white rounded-[32px] border border-gray-100 hover:border-[#0d9488]/30 hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-video rounded-[24px] overflow-hidden bg-gray-50 mb-4">
                <img 
                  src={item.productImage} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase text-[#0d9488]">
                  {item.category || "General"}
                </div>
              </div>

              <div className="px-2">
                <h3 className="text-xl font-black text-slate-800 mb-1">{item.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none">Price</p>
                    <p className="text-2xl font-black text-[#0d9488]">₹{item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none">In Stock</p>
                    <p className={`text-lg font-bold ${item.stock < 5 ? 'text-orange-500' : 'text-slate-700'}`}>
                      {item.stock} units
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* EMPTY STATE */
          <div className="col-span-full flex flex-col items-center justify-center p-16 bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-200 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Package size={40} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">No items in your shop yet</h3>
            <p className="text-gray-500 max-w-sm mb-8">
              It looks like your workshop is currently empty. Start by adding your first masterpiece to the marketplace!
            </p>
            <button 
              onClick={() => setActiveTab('add-product')}
              className="flex items-center gap-2 text-[#0d9488] font-black hover:gap-4 transition-all"
            >
              Add your first product <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}