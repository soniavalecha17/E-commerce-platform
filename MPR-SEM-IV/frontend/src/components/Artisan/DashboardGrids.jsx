import React from "react";
import { motion } from "framer-motion";

const DashboardGrids = ({ stats, recentOrders }) => {
  return (
    <div style={secondaryGridStyle}>
      {/* LEFT SIDE: Sales Analytics Bar Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={cardStyle}
      >
        <div style={cardHeader}>
          <h3 style={cardTitle}>Sales Analytics</h3>
          <span style={subtextStyle}>Last 7 Days</span>
        </div>
        
        {/* Animated Bar Chart Placeholder */}
        <div style={chartContainer}>
          {[0, 0, 0, 0, 0, 0, 0].map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              style={barStyle}
            />
          ))}
        </div>
        <div style={chartLabels}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
            <span key={day} style={labelStyle}>{day}</span>
          ))}
        </div>
      </motion.div>

      {/* RIGHT SIDE: Recent Orders */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={cardStyle}
      >
        <div style={cardHeader}>
          <h3 style={cardTitle}>Recent Orders</h3>
          <span style={viewAllLink}>View All</span>
        </div>

        <div style={orderListStyle}>
          {recentOrders ? recentOrders.map((order, idx) => (
            <div key={idx} style={orderRowStyle}>
              <div style={orderIconStyle}>🛒</div>
              <div style={{ flex: 1 }}>
                <p style={orderIDStyle}>Order {order.id}</p>
                <p style={orderCustStyle}>Customer: {order.customer}</p>
              </div>
              <span style={{ 
                ...statusBadgeStyle, 
                backgroundColor: order.status === "Pending" ? "#fef3c7" : "#dcfce7",
                color: order.status === "Pending" ? "#d97706" : "#16a34a"
              }}>
                {order.status}
              </span>
            </div>
          )) : (
            <p style={emptyStateText}>No recent orders found.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- STYLES ---
const secondaryGridStyle = {
  display: "grid",
  gridTemplateColumns: "1.6fr 1fr", // Chart is wider than orders
  gap: "25px",
  marginTop: "20px",
};

const cardStyle = {
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
  marginBottom: "20px",
};

const cardTitle = { margin: 0, fontSize: "18px", fontWeight: "700", color: "#1e293b" };

const chartContainer = {
  height: "180px",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  padding: "0 10px",
  borderBottom: "2px solid #f1f5f9",
};

const barStyle = {
  width: "28px",
  backgroundColor: "#3b82f6", // ArtLink Blue
  borderRadius: "6px 6px 0 0",
};

const chartLabels = { display: "flex", justifyContent: "space-between", marginTop: "10px", padding: "0 5px" };
const labelStyle = { fontSize: "12px", color: "#94a3b8" };

const orderListStyle = { display: "flex", flexDirection: "column", gap: "12px" };

const orderRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
};

const orderIconStyle = {
  width: "36px", height: "36px", backgroundColor: "white", borderRadius: "8px",
  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px"
};

const orderIDStyle = { margin: 0, fontSize: "14px", fontWeight: "600", color: "#1e293b" };
const orderCustStyle = { margin: 0, fontSize: "12px", color: "#64748b" };
const statusBadgeStyle = { fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "20px" };
const viewAllLink = { fontSize: "13px", color: "#3b82f6", fontWeight: "600", cursor: "pointer" };
const subtextStyle = { fontSize: "12px", color: "#94a3b8" };
const emptyStateText = { textAlign: "center", color: "#94a3b8", padding: "20px" };

export default DashboardGrids;