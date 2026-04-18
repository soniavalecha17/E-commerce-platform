import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import VoiceAssistant from "./VoiceAssistant";
import API from "../../utils/app"; 

const ArtisanDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get("/artisan/dashboard-stats", { withCredentials: true });
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Filtered statsData: Removed "Total Revenue"
  const statsData = [
    { label: "Total Products", value: stats?.totalProducts || 0, icon: "📦", color: "#3b82f6" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: "🛒", color: "#10b981" },
    { label: "Pending Orders", value: stats?.pendingOrders || 0, icon: "⏳", color: "#f59e0b" },
    { label: "Total Reviews", value: stats?.totalReviews || 0, icon: "⭐", color: "#f43f5e" },
  ];

  if (loading) {
    return (
      <div style={loadingContainer}>
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={loaderIcon}
        >
          ♻️
        </motion.div>
        <p>Fetching your artisan metrics...</p>
      </div>
    );
  }

  return (
    <main style={mainContainer}>
      {/* Header Section */}
      <div style={headerSection}>
        <div>
          <h2 style={titleStyle}>Dashboard Overview</h2>
          <p style={subtitleStyle}>
            A snapshot of your shop's inventory and customer activity.
          </p>
        </div>
        <div style={badgeStyle}>Active Shop</div>
      </div>

      {/* Optimized Stats Grid */}
      <div style={statsGrid}>
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
            style={statCardStyle}
          >
            <div style={{ ...iconCircle, backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div style={{ marginLeft: "20px" }}>
              <p style={statLabel}>{stat.label}</p>
              <h3 style={statValue}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Artisan Tips Section - Kept for visual balance */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        style={tipContainer}
      >
        <div style={tipBox}>
          <p style={tipText}>
            💡 <strong>Pro Tip:</strong> Keeping your "Pending Orders" low improves your shop's search ranking!
          </p>
        </div>
      </motion.div>

      <VoiceAssistant />
    </main>
  );
};

// --- STYLES ---

const mainContainer = {
  padding: "30px 0",
  maxWidth: "1200px",
  margin: "0 auto",
};

const loadingContainer = {
  padding: "100px",
  textAlign: "center",
  color: "#64748b",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px"
};

const loaderIcon = { fontSize: "30px" };

const headerSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginBottom: "40px",
  padding: "0 10px"
};

const titleStyle = { 
  margin: 0, 
  fontSize: "32px", 
  fontWeight: "900", 
  color: "#1e293b",
  letterSpacing: "-0.5px" 
};

const subtitleStyle = { 
  margin: "8px 0 0 0", 
  color: "#64748b", 
  fontSize: "16px",
  fontWeight: "500" 
};

const badgeStyle = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  padding: "6px 14px",
  borderRadius: "100px",
  fontSize: "12px",
  fontWeight: "700",
  textTransform: "uppercase"
};

const statsGrid = { 
  display: "grid", 
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
  gap: "25px", 
  marginBottom: "40px",
  padding: "0 10px"
};

const statCardStyle = { 
  backgroundColor: "white", 
  padding: "30px", 
  borderRadius: "24px", 
  border: "1px solid #e2e8f0", 
  display: "flex", 
  alignItems: "center", 
  cursor: "default",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
};

const iconCircle = { 
  width: "65px", 
  height: "65px", 
  borderRadius: "20px", 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center", 
  fontSize: "28px" 
};

const statLabel = { 
  margin: 0, 
  fontSize: "15px", 
  color: "#64748b", 
  fontWeight: "600" 
};

const statValue = { 
  margin: "4px 0 0 0", 
  fontSize: "28px", 
  fontWeight: "900", 
  color: "#0f172a" 
};

const tipContainer = {
  padding: "0 10px"
};

const tipBox = { 
  padding: "20px 25px", 
  backgroundColor: "#f0f9ff", 
  borderRadius: "20px", 
  border: "1px solid #bae6fd",
  display: "inline-block"
};

const tipText = { 
  margin: 0, 
  fontSize: "14px", 
  color: "#0369a1", 
  lineHeight: "1.6", 
  fontWeight: "500" 
};

export default ArtisanDashboard;