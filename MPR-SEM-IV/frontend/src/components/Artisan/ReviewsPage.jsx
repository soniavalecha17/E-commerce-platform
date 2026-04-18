import React, { useState } from "react";
import { motion } from "framer-motion";

const ReviewsPage = () => {
  // Initially empty state for reviews
  const [reviews, setReviews] = useState([]);

  return (
    <div style={pageContainer}>
      {/* 1. Header Section */}
      <div style={headerSection}>
        <h1 style={titleStyle}>Customer Reviews</h1>
        <p style={subtitleStyle}>Manage feedback and build your artisan reputation</p>
      </div>

      {/* 2. Rating Overview Stats */}
      <div style={ratingSummaryRow}>
        <div style={ratingScoreCard}>
          <h2 style={bigRating}>0.0</h2>
          <div style={starRow}>☆☆☆☆☆</div>
          <p style={totalReviewsText}>Total Reviews: 0</p>
        </div>
        
        <div style={ratingBreakdown}>
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} style={breakdownLine}>
              <span style={starLabel}>{star} Stars</span>
              <div style={progressBg}>
                <div style={{ ...progressFill, width: "0%" }}></div>
              </div>
              <span style={countLabel}>0</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Review List Section */}
      <div style={listHeader}>
        <h3 style={cardTitle}>Recent Feedback</h3>
        <div style={filterGroup}>
          <select style={filterSelect}>
            <option>All Ratings</option>
            <option>5 Stars</option>
            <option>4 Stars</option>
            <option>Critical (1-2 Stars)</option>
          </select>
        </div>
      </div>

      {/* 4. Empty State or List */}
      {reviews.length === 0 ? (
        <div style={emptyStateContainer}>
          <div style={emptyIcon}>⭐</div>
          <h3>No Reviews Yet</h3>
          <p>When customers purchase your products and leave feedback, they will appear here.</p>
        </div>
      ) : (
        <div style={reviewGrid}>
          {/* Review items will map here once backend is connected */}
        </div>
      )}
    </div>
  );
};

// --- STYLES ---

const pageContainer = {
  padding: "40px",
  backgroundColor: "#f8fafc",
  minHeight: "100vh",
};

const headerSection = { marginBottom: "35px" };
const titleStyle = { margin: 0, fontSize: "28px", fontWeight: "bold", color: "#1e293b" };
const subtitleStyle = { margin: "5px 0 0 0", color: "#64748b", fontSize: "16px" };

const ratingSummaryRow = {
  display: "grid",
  gridTemplateColumns: "1fr 2fr",
  gap: "30px",
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  marginBottom: "35px",
};

const ratingScoreCard = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderRight: "1px solid #f1f5f9",
};

const bigRating = { fontSize: "48px", margin: "0", color: "#1e293b" };
const starRow = { color: "#f59e0b", fontSize: "24px", margin: "10px 0" };
const totalReviewsText = { color: "#64748b", fontSize: "14px" };

const ratingBreakdown = { display: "flex", flexDirection: "column", gap: "10px" };
const breakdownLine = { display: "flex", alignItems: "center", gap: "15px" };
const starLabel = { width: "60px", fontSize: "13px", color: "#475569", fontWeight: "600" };
const progressBg = { flex: 1, height: "8px", backgroundColor: "#f1f5f9", borderRadius: "4px" };
const progressFill = { height: "100%", backgroundColor: "#f59e0b", borderRadius: "4px" };
const countLabel = { width: "20px", fontSize: "13px", color: "#94a3b8" };

const listHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const cardTitle = { margin: 0, fontSize: "18px", fontWeight: "bold" };
const filterSelect = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  outline: "none",
};

const emptyStateContainer = {
  textAlign: "center",
  padding: "80px 20px",
  backgroundColor: "white",
  borderRadius: "16px",
  border: "2px dashed #e2e8f0",
  color: "#64748b",
};

const emptyIcon = { fontSize: "48px", marginBottom: "20px" };
const reviewGrid = { display: "flex", flexDirection: "column", gap: "20px" };
const filterGroup = {
  display: "flex",
  alignItems: "center",
  gap: "10px"
};
export default ReviewsPage;