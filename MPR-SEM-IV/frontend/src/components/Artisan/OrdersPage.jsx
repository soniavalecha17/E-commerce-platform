import React, { useState, useEffect } from "react";
import API from "../../utils/app"; // Assuming this is your axios instance

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  // 1. Fetch data from your new backend logic
  useEffect(() => {
    const fetchArtisanOrders = async () => {
      try {
        const res = await API.get("/orders/getorders", { withCredentials: true });
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching artisan orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtisanOrders();
  }, []);

  // 2. Dynamic Summary Stats
  const totalOrders = orders.length;
  const pendingCount = orders.filter(o => o.status === "PENDING").length;
  const shippedCount = orders.filter(o => o.status === "SHIPPED").length;
  const deliveredCount = orders.filter(o => o.status === "DELIVERED").length;

  // 3. Status Filter Logic
  const filteredOrders = filter === "All" 
    ? orders 
    : orders.filter(o => o.status.toUpperCase() === filter.toUpperCase());

  if (loading) {
    return <div style={{ padding: "100px", textAlign: "center", color: "#0d9488" }}>Syncing with your shop...</div>;
  }

  return (
    <div style={pageContainer}>
      {/* 1. Header Section */}
      <div style={headerSection}>
        <h1 style={titleStyle}>Orders Management</h1>
        <p style={subtitleStyle}>Track and manage all customer orders</p>
      </div>

      {/* 2. Order Summary Stats - Now Dynamic */}
      <div style={summaryRow}>
        <div style={summaryItem}>Total Orders: <span style={statText}>{totalOrders}</span></div>
        <div style={summaryItem}>Pending: <span style={statText}>{pendingCount}</span></div>
        <div style={summaryItem}>Shipped: <span style={statText}>{shippedCount}</span></div>
        <div style={summaryItem}>Delivered: <span style={statText}>{deliveredCount}</span></div>
      </div>

      {/* 3. Search and Filter Bar */}
      <div style={filterBar}>
        <div style={searchContainer}>
          <input type="text" placeholder="Search Order ID..." style={searchInput} />
          <span style={{ color: "#0d9488" }}>🔍</span>
        </div>
        <div style={filterActions}>
          <span style={filterLabel}>Status:</span>
          {["All", "Pending", "Shipped", "Delivered"].map((status) => (
            <button 
                key={status} 
                onClick={() => setFilter(status)}
                style={{...filterBtn, color: filter === status ? "#0d9488" : "#94a3b8"}}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Orders Table */}
      <div style={tableContainer}>
        <table style={orderTable}>
          <thead>
            <tr style={tableHeaderRow}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Qty</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" style={emptyStateCell}>
                  <div style={emptyContent}>
                    <p style={{ fontSize: "24px", margin: "0", color: "#0d9488" }}>📦</p>
                    <p>No {filter !== "All" ? filter.toLowerCase() : ""} orders found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                // Map through orderItems since we only sent this Artisan's items from the backend
                order.orderItems.map((item, idx) => (
                  <tr key={`${order._id}-${idx}`} style={tableRow}>
                    <td style={tdStyle}>#{order._id.slice(-6).toUpperCase()}</td>
                    <td style={tdStyle}>{order.customer?.username || "Guest"}</td>
                    <td style={tdStyle}>{item.productId?.name || "Product"}</td>
                    <td style={tdStyle}>{item.quantity}</td>
                    <td style={{...tdStyle, fontWeight: "700"}}>₹{item.price * item.quantity}</td>
                    <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      <span style={{...statusBadge, ...statusColors[order.status]}}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- STYLES ---

const pageContainer = { padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" };
const headerSection = { textAlign: "center", marginBottom: "40px" };
const titleStyle = { margin: 0, fontSize: "28px", fontWeight: "bold", color: "#1e293b" };
const subtitleStyle = { margin: "5px 0 0 0", color: "#64748b", fontSize: "16px" };

const summaryRow = {
  display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", padding: "20px",
  backgroundColor: "white", borderRadius: "12px", border: "1px solid #e2e8f0",
  borderTop: "4px solid #0d9488", marginBottom: "30px",
};

const summaryItem = { fontWeight: "600", color: "#1e293b", fontSize: "14px", textAlign: "center" };
const statText = { color: "#0d9488", fontWeight: "900", marginLeft: "5px", fontSize: "16px" };

const filterBar = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  backgroundColor: "white", padding: "15px 25px", borderRadius: "12px 12px 0 0",
  border: "1px solid #e2e8f0", borderBottom: "none",
};

const searchContainer = { display: "flex", alignItems: "center", gap: "10px" };
const searchInput = { border: "none", outline: "none", fontSize: "14px", width: "200px", color: "#1e293b" };
const filterActions = { display: "flex", gap: "15px", alignItems: "center" };
const filterLabel = { fontSize: "14px", fontWeight: "600", color: "#64748b" };
const filterBtn = { background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600", transition: "0.2s" };

const tableContainer = { backgroundColor: "white", borderRadius: "0 0 12px 12px", border: "1px solid #e2e8f0", overflow: "hidden" };
const orderTable = { width: "100%", borderCollapse: "collapse", textAlign: "left" };
const tableHeaderRow = { backgroundColor: "#f0fdfa", borderBottom: "2px solid #0d9488" };
const thStyle = { padding: "15px 20px", fontSize: "12px", fontWeight: "700", color: "#0d9488", textTransform: "uppercase" };
const tdStyle = { padding: "15px 20px", fontSize: "14px", color: "#1e293b", borderBottom: "1px solid #f1f5f9" };
const tableRow = { transition: "background 0.2s" };

const statusBadge = { padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" };
const statusColors = {
  PENDING: { backgroundColor: "#fef3c7", color: "#92400e" },
  SHIPPED: { backgroundColor: "#e0f2fe", color: "#075985" },
  DELIVERED: { backgroundColor: "#dcfce7", color: "#166534" },
  CANCELLED: { backgroundColor: "#fee2e2", color: "#991b1b" }
};

const emptyStateCell = { padding: "60px 0", textAlign: "center", color: "#94a3b8" };
const emptyContent = { display: "flex", flexDirection: "column", gap: "10px" };

export default OrdersPage;