import React, { useState, useEffect } from "react";
import API from "../../utils/app";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders/artisan/all").then(res => setOrders(res.data.data));
  }, []);

  const handleUpdate = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/update-status`, { status: newStatus });
      // Refresh local state
      setOrders(orders.map(o => o._id === orderId ? {...o, status: newStatus} : o));
    } catch (err) { alert("Failed to update status"); }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Orders</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id.slice(-6)}</td>
              <td>{order.customer?.username}</td>
              <td>{order.status}</td>
              <td>
                <select onChange={(e) => handleUpdate(order._id, e.target.value)}>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;