import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import VoiceAssistant from "./VoiceAssistant";
import API from "../../utils/app";

const ArtisanDashboard = () => {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, pendingOrders: 0, totalReviews: 0 });
  const [reviewsList, setReviewsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, reviewsRes, ordersRes] = await Promise.all([
          API.get("/artisan/dashboard-stats", { withCredentials: true }),
          API.get("/reviews/artisan/all", { withCredentials: true }),
          API.get("/artisan/orders/all", { withCredentials: true })
        ]);

        if (statsRes.data.success) setStats(statsRes.data.data);
        if (reviewsRes.data.success) setReviewsList(reviewsRes.data.data);
        if (ordersRes.data.statusCode === 200) {
  setOrdersList(ordersRes.data.message);
}
      } catch (err) {
        console.error("Dashboard Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // 1. Perform the update
      await API.patch(`/orders/updateorderstatus/${orderId}`, { status: newStatus });
      
      // 2. Update local state
      setOrdersList(prevOrders => 
        prevOrders.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
      );
    } catch (err) {
      console.error("Status Update Error:", err);
      // More helpful error feedback
      const errorMsg = err.response?.data?.message || "Failed to update status";
      alert(errorMsg);
    }
  };

  const statsData = [
    { label: "Total Products", value: stats?.totalProducts || 0, icon: "📦", color: "#3b82f6" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: "🛒", color: "#10b981" },
    { label: "Pending Orders", value: stats?.pendingOrders || 0, icon: "⏳", color: "#f59e0b" },
    { label: "Total Reviews", value: stats?.totalReviews || 0, icon: "⭐", color: "#f43f5e" },
  ];

  if (loading) return <div style={loadingContainer}>Fetching your artisan metrics...</div>;

  return (
    <main style={mainContainer}>
      <div style={headerSection}>
        <div>
          <h2 style={titleStyle}>Dashboard Overview</h2>
          <p style={subtitleStyle}>A snapshot of your shop's inventory and customer activity.</p>
        </div>
      </div>

      <div style={statsGrid}>
        {statsData.map((stat, index) => (
          <motion.div key={index} whileHover={{ y: -5 }} style={statCardStyle}>
            <div style={{ ...iconCircle, backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
            <div style={{ marginLeft: "20px" }}>
              <p style={statLabel}>{stat.label}</p>
              <h3 style={statValue}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <section style={{ marginTop: "40px", padding: "0 10px" }}>
        <h3 style={sectionTitle}>Recent Orders</h3>
        <div style={tableContainer}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Product Name</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
  {Array.isArray(ordersList) ? (
    ordersList.map((order) => (
      <tr key={order._id}>
        <td style={tdStyle}>{order.orderItems?.[0]?.productId?.name || "N/A"}</td>
        <td style={tdStyle}>{order.customer?.username || "Unknown"}</td>
        <td style={tdStyle}>{order.status}</td>
        <td style={tdStyle}>
          <select 
            value={order.status} 
            onChange={(e) => handleStatusChange(order._id, e.target.value)} 
            style={selectStyle}
          >
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
        No orders found or loading data...
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: "40px", padding: "0 10px" }}>
        <h3 style={sectionTitle}>Recent Customer Reviews</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {reviewsList.map((review) => (
            <div key={review._id} style={reviewCardStyle}>
              <strong>{review.customer_name}</strong> - {review.rating} ⭐
              <p>{review.review_text}</p>
            </div>
          ))}
        </div>
      </section>

      <VoiceAssistant />
    </main>
  );
};

// --- STYLES ---
const mainContainer = { padding: "30px 0", maxWidth: "1200px", margin: "0 auto" };
const loadingContainer = { padding: "100px", textAlign: "center" };
const headerSection = { display: "flex", justifyContent: "space-between", marginBottom: "40px", padding: "0 10px" };
const titleStyle = { fontSize: "32px", fontWeight: "900", color: "#1e293b" };
const subtitleStyle = { margin: "8px 0", color: "#64748b" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "25px", padding: "0 10px" };
const statCardStyle = { backgroundColor: "white", padding: "30px", borderRadius: "24px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center" };
const iconCircle = { width: "65px", height: "65px", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" };
const statLabel = { margin: 0, fontSize: "15px", color: "#64748b" };
const statValue = { margin: "4px 0 0 0", fontSize: "28px", fontWeight: "900" };
const sectionTitle = { fontSize: "22px", fontWeight: "900", marginBottom: "20px", color: "#1e293b" };
const tableContainer = { backgroundColor: "white", borderRadius: "20px", border: "1px solid #e2e8f0", overflow: "hidden" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thStyle = { padding: "15px 20px", textAlign: "left", color: "#64748b" };
const tdStyle = { padding: "15px 20px", borderTop: "1px solid #f1f5f9" };
const selectStyle = { padding: "5px 10px", borderRadius: "8px", border: "1px solid #cbd5e1" };
const reviewCardStyle = { backgroundColor: "white", padding: "20px", borderRadius: "20px", border: "1px solid #e2e8f0" };

export default ArtisanDashboard;