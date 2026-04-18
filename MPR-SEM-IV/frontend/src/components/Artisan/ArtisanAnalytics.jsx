import React from "react";
import { motion } from "framer-motion";

const ArtisanAnalytics = () => {
  return (
    <div style={dashboardRow}>
      
      {/* LEFT SIDE: Sales Analytics (Bar Chart Placeholder) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        style={contentCard}
      >
        <div style={cardHeader}>
          <h3 style={cardTitle}>Sales Analytics</h3>
          <span style={timeFrame}>Last 7 Days</span>
        </div>
        
        {/* Placeholder for Bar Chart */}
        <div style={chartPlaceholder}>
          {[40, 70, 45, 90, 65, 80, 55].map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              style={barStyle} // Updated to Teal #0d9488
            />
          ))}
        </div>
        <div style={chartLabels}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <span key={day} style={labelStyle}>{day}</span>
          ))}
        </div>
      </motion.div>

      {/* RIGHT SIDE: Recent Orders */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={contentCard}
      >
        <div style={cardHeader}>
          <h3 style={cardTitle}>Recent Orders</h3>
          <button style={viewAllBtn}>View All</button>
        </div>

        <div style={orderList}>
          {/* Order Item 1 */}
          <div style={orderItem}>
            <div style={orderIcon}>🛍️</div>
            <div style={{ flex: 1 }}>
              <p style={orderID}>Order #1245</p>
              <p style={customerName}>Customer: Riya</p>
            </div>
            <span style={statusBadge}>Pending</span>
          </div>

          {/* Order Item 2 */}
          <div style={orderItem}>
            <div style={orderIcon}>🛍️</div>
            <div style={{ flex: 1 }}>
              <p style={orderID}>Order #1244</p>
              <p style={customerName}>Customer: Rahul</p>
            </div>
            {/* Status badge updated to Teal tint */}
            <span style={{ ...statusBadge, backgroundColor: "#f0fdfa", color: "#0d9488" }}>Completed</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- UPDATED TEAL STYLES (#0d9488) ---

const dashboardRow = {
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr", 
  gap: "25px",
  marginTop: "30px",
};

const contentCard = {
  backgroundColor: "white",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
};

const cardTitle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "700",
  color: "#1e293b",
};

const chartPlaceholder = {
  height: "200px",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  padding: "0 10px",
  borderBottom: "2px solid #f1f5f9",
  backgroundColor: "#f0fdfa", // Very light teal wash
  borderRadius: "12px 12px 0 0",
};

const barStyle = {
  width: "32px",
  backgroundColor: "#0d9488", // Primary Brand Teal
  borderRadius: "6px 6px 0 0",
};

const chartLabels = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px",
  padding: "0 5px",
};

const labelStyle = {
  fontSize: "12px",
  color: "#64748b",
};

const orderList = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const orderItem = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  padding: "12px",
  borderRadius: "12px",
  backgroundColor: "#f8fafc",
  border: "1px solid #f1f5f9",
};

const orderIcon = {
  width: "40px",
  height: "40px",
  backgroundColor: "white",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  border: "1px solid #0d9488", // Added teal border to icons
};

const orderID = {
  margin: 0,
  fontSize: "14px",
  fontWeight: "600",
  color: "#1e293b",
};

const customerName = {
  margin: 0,
  fontSize: "13px",
  color: "#64748b",
};

const statusBadge = {
  fontSize: "12px",
  fontWeight: "700",
  padding: "4px 10px",
  borderRadius: "20px",
  backgroundColor: "#fef3c7", // Kept amber for warning/pending
  color: "#d97706",
};

const viewAllBtn = {
  background: "none",
  border: "none",
  color: "#0d9488", // Updated to Teal
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
};

const timeFrame = {
  fontSize: "12px",
  color: "#64748b",
  fontWeight: "600",
};

export default ArtisanAnalytics;