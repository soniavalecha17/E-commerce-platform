import React from "react";
import { motion } from "framer-motion";

const AnalyticsPage = () => {
  return (
    <div style={pageContainer}>
      {/* 1. Header Section */}
      <div style={headerSection}>
        <h1 style={titleStyle}>Analytics & Insights</h1>
        <p style={subtitleStyle}>Understand your shop performance and growth</p>
      </div>

      {/* 2. Performance Metrics Row */}

      {/* 3. Charts Section */}
      <div style={chartsGrid}>
        
        {/* Sales Trend Placeholder */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={chartCard}>
          <h3 style={cardTitle}>Sales Trend (Line Chart)</h3>
          <p style={cardSubtext}>Shows daily/weekly revenue</p>
          <div style={chartPlaceholder}>
            <p style={placeholderText}>Connect backend to visualize sales trends</p>
          </div>
        </motion.div>

        {/* Orders by Status Placeholder */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={chartCard}>
          <h3 style={cardTitle}>Orders by Status (Pie Chart)</h3>
          <p style={cardSubtext}>Pending / Shipped / Delivered distribution</p>
          <div style={chartPlaceholder}>
            <p style={placeholderText}>Connect backend to visualize order status</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

// --- STYLES ---

const pageContainer = {
  padding: "5px",
  backgroundColor: "#f8fafc",
  minHeight: "80vh",
};

const headerSection = {
  marginBottom: "35px",
  textAlign: "left",
};

const titleStyle = { margin: 0, fontSize: "28px", fontWeight: "bold", color: "#1e293b" };
const subtitleStyle = { margin: "5px 0 0 0", color: "#64748b", fontSize: "16px" };

const metricsRow = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  marginBottom: "35px",
};

const metricCard = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  textAlign: "center",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
};

const metricLabel = { margin: "0 0 10px 0", fontSize: "14px", color: "#64748b", fontWeight: "600" };
const metricValue = { margin: 0, fontSize: "24px", fontWeight: "bold", color: "#1e293b" };

const chartsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "25px",
};

const chartCard = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  minHeight: "350px",
};

const cardTitle = { margin: 0, fontSize: "18px", fontWeight: "bold", color: "#1e293b" };
const cardSubtext = { margin: "5px 0 20px 0", fontSize: "14px", color: "#94a3b8" };

const chartPlaceholder = {
  height: "220px",
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  border: "2px dashed #e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const placeholderText = { color: "#94a3b8", fontSize: "14px", fontWeight: "500" };

export default AnalyticsPage;