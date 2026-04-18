import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddProduct from "./AddProduct";

const ArtisanOverview = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  // Animation Variants
  const containerVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const cardVars = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.03, boxShadow: "0px 10px 30px rgba(0,0,0,0.1)" }
  };

  return (
    <div style={layoutStyle}>
      {/* --- Glassmorphism Sidebar --- */}
      <motion.aside 
        initial={{ x: -100 }} 
        animate={{ x: 0 }} 
        style={sidebarStyle}
      >
        <div style={logoStyle}>🎨 ArtisanHub</div>
        <nav style={navStyle}>
          {["Overview", "Add Product", "My Inventory", "Sales"].map((tab) => (
            <motion.div
              key={tab}
              whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.1)" }}
              onClick={() => setActiveTab(tab)}
              style={{
                ...navItemStyle,
                color: activeTab === tab ? "#60a5fa" : "#94a3b8",
                borderLeft: activeTab === tab ? "4px solid #60a5fa" : "4px solid transparent"
              }}
            >
              {tab}
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      {/* --- Main Content --- */}
      <main style={mainContentStyle}>
        <motion.header variants={containerVars} initial="initial" animate="animate" style={headerStyle}>
          <div>
            <motion.h1 style={{ fontSize: "32px", color: "#1e293b" }}>Welcome back, Alex!</motion.h1>
            <p style={{ color: "#64748b" }}>Here is what's happening with your shop today.</p>
          </div>
          <div style={profileBadge}>A</div>
        </motion.header>

        <AnimatePresence mode="wait">
          {activeTab === "Overview" ? (
            <motion.div 
              key="overview"
              variants={containerVars}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Quick Stats Grid */}
              <div style={statsGrid}>
                <StatCard label="Total Sales" value="-" color="#3b82f6" />
                <StatCard label="Active Products" value="-" color="#10b981" />
                <StatCard label="Pending Orders" value="-" color="#f59e0b" />
              </div>

              {/* Action Center */}
              <h2 style={{ marginTop: "40px", color: "#1e293b" }}>Quick Management</h2>
              <div style={actionGrid}>
                <ActionCard 
                  title="Add New Work" 
                  desc="List a new masterpiece to your shop" 
                  icon="➕" 
                  onClick={() => setActiveTab("Add Product")}
                />
                <ActionCard 
                  title="Edit Inventory" 
                  desc="Update prices, stock, or descriptions" 
                  icon="✏️" 
                  onClick={() => setActiveTab("My Inventory")}
                />
                <ActionCard 
                  title="View Analytics" 
                  desc="See which products are trending" 
                  icon="📈" 
                />
              </div>
            </motion.div>
          ) : activeTab === "Add Product" ? (
            <motion.div key="add" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <AddProduct />
            </motion.div>
          ) : (
            <div style={{ padding: "50px", textAlign: "center", color: "#64748b" }}>
              <h2>{activeTab} Module</h2>
              <p>Fetching your data from the artisan cloud...</p>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

// --- Sub-Components for Cleanliness ---

const StatCard = ({ label, value, color }) => (
  <motion.div whileHover={{ y: -5 }} style={statCardStyle}>
    <span style={{ color: "#64748b", fontSize: "14px" }}>{label}</span>
    <h3 style={{ fontSize: "24px", margin: "10px 0", color: color }}>{value}</h3>
  </motion.div>
);

const ActionCard = ({ title, desc, icon, onClick }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }} 
    whileTap={{ scale: 0.98 }} 
    onClick={onClick}
    style={actionCardStyle}
  >
    <div style={{ fontSize: "30px", marginBottom: "15px" }}>{icon}</div>
    <h4 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>{title}</h4>
    <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>{desc}</p>
  </motion.div>
);

// --- Modern Styles ---

const layoutStyle = {
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "#f1f5f9",
  fontFamily: "'Inter', sans-serif",
};

const sidebarStyle = {
  width: "260px",
  background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
  padding: "40px 20px",
  color: "white",
  boxShadow: "4px 0 15px rgba(0,0,0,0.05)",
};

const logoStyle = {
  fontSize: "24px",
  fontWeight: "800",
  letterSpacing: "-1px",
  marginBottom: "60px",
  textAlign: "center"
};

const navStyle = { display: "flex", flexDirection: "column", gap: "10px" };

const navItemStyle = {
  padding: "15px 20px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600",
  transition: "all 0.2s",
};

const mainContentStyle = {
  flex: 1,
  padding: "40px 60px",
  overflowY: "auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px",
};

const profileBadge = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "20px",
  boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)"
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "25px",
};

const statCardStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
};

const actionGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const actionCardStyle = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "24px",
  cursor: "pointer",
  border: "1px solid #e2e8f0",
  transition: "all 0.3s ease",
};

export default ArtisanOverview;