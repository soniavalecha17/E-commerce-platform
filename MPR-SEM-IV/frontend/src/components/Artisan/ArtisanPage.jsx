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
  const [artisanName, setArtisanName] = useState("Artisan"); // State for name

  // 👤 Load User Data from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setArtisanName(userData.username || "Artisan");
    }
  }, []);

  // 🔊 Force-load Hindi Voice on component mount
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const hVoice = allVoices.find(v => v.lang === 'hi-IN' || v.lang.includes('hi'));
      if (hVoice) setHindiVoice(hVoice);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speakHindi = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (hindiVoice) utterance.voice = hindiVoice;
    utterance.lang = 'hi-IN';
    utterance.pitch = 1;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

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
          <div style={profileArea}>
            {/* Displaying Artisan Name and First Letter Icon */}
            <span style={userNameStyle}>{artisanName}</span>
            <div style={avatarSquare}>
              {artisanName.charAt(0).toUpperCase()}
            </div>
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
const profileArea = { display: "flex", alignItems: "center", gap: "12px" }; // Added gap for text
const userNameStyle = { fontSize: "16px", fontWeight: "700", color: "#1e293b", textTransform: "capitalize" };
const avatarSquare = { width: "45px", height: "45px", backgroundColor: "#0d9488", color: "white", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px", boxShadow: "0 4px 6px rgba(13, 148, 136, 0.2)" };
const actionGrid = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", padding: "30px 40px" };
const actionCard = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", padding: "25px", backgroundColor: "white", border: "2px solid #e2e8f0", borderRadius: "24px", cursor: "pointer", transition: "all 0.2s", color: "#64748b", fontWeight: "800", fontSize: "16px" };
const activeActionCard = { ...actionCard, borderColor: "#0d9488", backgroundColor: "rgba(13, 148, 136, 0.05)", color: "#0d9488", transform: "scale(1.02)", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" };
const mainContent = { padding: "0 40px 60px 40px" };
const pageLabel = { marginBottom: "20px", paddingLeft: "10px" };