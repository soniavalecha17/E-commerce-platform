import React, { useState } from "react";

const ProfilePage = () => {
  // Initial state for profile data
  const [profile, setProfile] = useState({
    name: "",
    shopName: "",
    bio: "",
    location: "",
    email: "",
    phone: "",
    joinedDate: "Jan 2024"
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div style={pageContainer}>
      {/* 1. Profile Header */}
      <div style={headerSection}>
        <h1 style={titleStyle}>My Profile</h1>
        <p style={subtitleStyle}>Manage your personal and shop information</p>
      </div>

      <div style={profileGrid}>
        {/* Left Column: Profile Card */}
        <div style={leftColumn}>
          <div style={profileCard}>
            {/* Avatar with Teal Background */}
            <div style={avatarCircle}>
              {profile.name ? profile.name[0].toUpperCase() : "A"}
            </div>
            <h2 style={displayName}>{profile.name || "Artisan Name"}</h2>
            <p style={verificationBadge}>✅ Verified Seller</p>
            <div style={divider}></div>
            <div style={statsRow}>
              <div style={statBox}>
                <span style={statLabel}>Member Since</span>
                <span style={statValue}>{profile.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Settings */}
        <div style={rightColumn}>
          <div style={settingsCard}>
            <h3 style={cardTitle}>Shop Details</h3>
            <div style={inputGroup}>
              <label style={labelStyle}>Full Name</label>
              <input 
                type="text" 
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your name" 
                style={inputStyle} 
              />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Shop Name</label>
              <input 
                type="text" 
                name="shopName"
                value={profile.shopName}
                onChange={handleChange}
                placeholder="e.g. Traditional Pottery Hub" 
                style={inputStyle} 
              />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>Bio / Description</label>
              <textarea 
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                placeholder="Tell your story to customers..." 
                style={{...inputStyle, height: "100px"}} 
              />
            </div>

            <h3 style={{...cardTitle, marginTop: "30px"}}>Contact Information</h3>
            <div style={row}>
              <div style={{flex: 1}}>
                <label style={labelStyle}>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="email@example.com" 
                  style={inputStyle} 
                />
              </div>
              <div style={{flex: 1}}>
                <label style={labelStyle}>Phone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX" 
                  style={inputStyle} 
                />
              </div>
            </div>
            
            <button style={saveBtn}>Update Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---

const pageContainer = { padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh" };
const headerSection = { marginBottom: "35px" };
const titleStyle = { margin: 0, fontSize: "28px", fontWeight: "bold", color: "#1e293b" };
const subtitleStyle = { margin: "5px 0 0 0", color: "#64748b", fontSize: "16px" };

const profileGrid = { display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px" };

const leftColumn = { display: "flex", flexDirection: "column", gap: "20px" };
const profileCard = {
  backgroundColor: "white",
  padding: "40px 20px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  textAlign: "center",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
};

const avatarCircle = {
  width: "100px",
  height: "100px",
  backgroundColor: "#0d9488", // Updated to Teal 600
  color: "white",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "40px",
  fontWeight: "bold",
  margin: "0 auto 20px"
};

const displayName = { margin: "0 0 5px 0", fontSize: "20px", fontWeight: "bold" };
const verificationBadge = { color: "#0d9488", fontSize: "14px", fontWeight: "600", margin: 0 };
const divider = { height: "1px", backgroundColor: "#f1f5f9", margin: "20px 0" };
const statsRow = { display: "flex", justifyContent: "center" };
const statBox = { display: "flex", flexDirection: "column", gap: "5px" };
const statLabel = { fontSize: "12px", color: "#64748b", textTransform: "uppercase" };
const statValue = { fontWeight: "bold", color: "#1e293b" };

const rightColumn = { display: "flex", flexDirection: "column" };
const settingsCard = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
};

const cardTitle = { margin: "0 0 20px 0", fontSize: "18px", fontWeight: "bold" };
const inputGroup = { marginBottom: "15px" };
const labelStyle = { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#475569" };
const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  boxSizing: "border-box",
  outline: "none"
};

const row = { display: "flex", gap: "20px", marginBottom: "15px" };
const saveBtn = {
  marginTop: "20px",
  padding: "12px 24px",
  backgroundColor: "#0d9488", // Updated to Teal 600
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
  width: "200px"
};

export default ProfilePage;