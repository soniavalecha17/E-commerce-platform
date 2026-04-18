import React, { useState, useEffect } from "react";
import ArtisanDashboard from "./ArtisanDashboard";
import ProductsPage from "./ProductsPage";
import AddProduct from "./AddProduct"; 
import OrdersPage from "./OrdersPage";
import ReviewsPage from "./ReviewsPage";
import ProfilePage from "./ProfilePage";
import VoiceAssistant from "./VoiceAssistant";
import { ChevronDown, LayoutDashboard, Package, PlusCircle } from 'lucide-react';

export default function ArtisanPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [view, setView] = useState('artisan'); 
  const [hindiVoice, setHindiVoice] = useState(null);

  // 🔊 Force-load Hindi Voice on component mount
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const hVoice = allVoices.find(v => v.lang === 'hi-IN' || v.lang.includes('hi'));
      if (hVoice) setHindiVoice(hVoice);
    };

    loadVoices();
    // Chrome needs this event listener because voices load asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // 🎙 Custom Speak Function for Hindi
  const speakHindi = (text) => {
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    
    utterance.lang = 'hi-IN';
    utterance.pitch = 1;
    utterance.rate = 0.9; // Slightly slower for better clarity for rural users
    window.speechSynthesis.speak(utterance);
  };

  // 🧠 Voice Command Brain
  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes("सामान") || lowerCommand.includes("प्रोडक्ट") || lowerCommand.includes("उत्पाद")) {
      setActiveTab("Products");
      speakHindi("ठीक है, आपके उत्पाद दिखा रही हूँ।");
    } 
    else if (lowerCommand.includes("होम") || lowerCommand.includes("मुख्य") || lowerCommand.includes("डैशबोर्ड")) {
      setActiveTab("Dashboard");
      speakHindi("होम पेज पर जा रहे हैं।");
    } 
    else if (lowerCommand.includes("ऑर्डर") || lowerCommand.includes("आर्डर")) {
      setActiveTab("Orders");
      speakHindi("आपके नए ऑर्डर यहाँ हैं।");
    }
    else {
      speakHindi("क्षमा करें, मुझे समझ नहीं आया।");
    }
  };

  const renderContent = () => {
    const currentTab = activeTab.trim();
    switch (currentTab) {
      case "Dashboard": return <ArtisanDashboard />;
      case "Products": return <ProductsPage setActiveTab={setActiveTab} />; 
      case "AddProduct": 
      case "add-product": return <AddProduct onBack={() => setActiveTab("Products")} />;
      case "Orders": return <OrdersPage />;
      case "Reviews": return <ReviewsPage />;
      case "Profile": return <ProfilePage />;
      default: return <ArtisanDashboard />;
    }
  };

  return (
    <div style={appContainer}>
      <header style={headerBar}>
        <div style={logoSection}>
          <span style={logoText}>ArtLink</span>
        </div>

        <div style={headerRight}>
          <div className="relative">
            <select 
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-full px-6 py-2 pr-10 text-sm font-bold text-[#0d9488] focus:outline-none cursor-pointer"
            >
              <option value="artisan">Artisan View</option>
              <option value="customer">Customer View</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0d9488] pointer-events-none" size={16} />
          </div>
          <div style={profileArea}>
            <div style={avatarSquare}>N</div>
          </div>
        </div>
      </header>

      <div style={actionGrid}>
          <button onClick={() => setActiveTab("Dashboard")} style={activeTab === "Dashboard" ? activeActionCard : actionCard}>
             <LayoutDashboard size={32} />
             <span>Home</span>
          </button>
          <button onClick={() => setActiveTab("Products")} style={(activeTab === "Products" || activeTab === "AddProduct") ? activeActionCard : actionCard}>
             <PlusCircle size={32} />
             <span>Add / My Products</span>
          </button>
          <button onClick={() => setActiveTab("Orders")} style={activeTab === "Orders" ? activeActionCard : actionCard}>
             <Package size={32} />
             <span>New Orders</span>
          </button>
      </div>

      <main style={mainContent}>
        <div style={pageLabel}>
            <h2 style={{fontSize: '24px', fontWeight: '900', color: '#1e293b'}}>
                Showing: {activeTab === "AddProduct" ? "Add New Product" : activeTab}
            </h2>
        </div>
        {renderContent()}
      </main>

      <VoiceAssistant 
        language="hi-IN" 
        onCommand={handleVoiceCommand} 
      />
    </div>
  );
}

// --- STYLES ---
const appContainer = { backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" };
const headerBar = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 40px", backgroundColor: "#ffffff", borderBottom: "2px solid #e2e8f0", position: "sticky", top: 0, zIndex: 100 };
const logoSection = { display: "flex", alignItems: "center" };
const logoText = { fontSize: "28px", fontWeight: "900", color: "#0d9488" };
const headerRight = { display: "flex", alignItems: "center", gap: "20px" };
const profileArea = { display: "flex", alignItems: "center" };
const avatarSquare = { width: "45px", height: "45px", backgroundColor: "#1e293b", color: "white", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px" };
const actionGrid = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", padding: "30px 40px" };
const actionCard = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", padding: "25px", backgroundColor: "white", border: "2px solid #e2e8f0", borderRadius: "24px", cursor: "pointer", transition: "all 0.2s", color: "#64748b", fontWeight: "800", fontSize: "16px" };
const activeActionCard = { ...actionCard, borderColor: "#0d9488", backgroundColor: "rgba(13, 148, 136, 0.05)", color: "#0d9488", transform: "scale(1.02)", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" };
const mainContent = { padding: "0 40px 60px 40px" };
const pageLabel = { marginBottom: "20px", paddingLeft: "10px" };