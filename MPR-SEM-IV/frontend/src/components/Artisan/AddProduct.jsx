import React, { useState } from "react";
import API from "../../utils/app"; 

// Pass onBack as a prop to navigate back to the dashboard after success
function AddProduct({ onBack }) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "", 
    category: "Pottery", 
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 1. Create FormData object for multipart/form-data upload
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("category", product.category);
    
    if (image) {
      formData.append("productImage", image);
    }

    try {
      // 2. API Call to your backend
      const response = await API.post("/products/createproduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Success! Your product is now live on the marketplace. 🏺");
        
        // Reset form state
        setProduct({ name: "", description: "", price: "", stock: "", category: "Pottery" });
        setImage(null);
        setPreview(null);

        // 3. IMPORTANT: Trigger the navigation back to the Dashboard
        // This ensures the Dashboard re-fetches its stats and shows the updated 'Total Products'
        if (onBack) onBack(); 
      }
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={pageWrapperStyle}>
      <div style={formContainerStyle}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
           <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#1e293b", margin: "0" }}>List Your Craft</h2>
           <p style={{ color: "#64748b", marginTop: "5px" }}>Fill in the details to showcase your work to customers.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={gridStyle}>
            {/* Left Column: Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={labelStyle}>Product Title</label>
                <input type="text" name="name" value={product.name} placeholder="e.g. Hand-painted Ceramic Vase" style={inputStyle} onChange={handleChange} required />
              </div>

              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Price (₹)</label>
                  <input type="number" name="price" value={product.price} placeholder="0.00" style={inputStyle} onChange={handleChange} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Stock Quantity</label>
                  <input type="number" name="stock" value={product.stock} placeholder="e.g. 10" style={inputStyle} onChange={handleChange} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Category</label>
                  <select name="category" value={product.category} style={inputStyle} onChange={handleChange}>
                    <option>Pottery</option>
                    <option>Jewelry</option>
                    <option>Textiles</option>
                    <option>Woodwork</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Detailed Description</label>
                <textarea name="description" value={product.description} rows="5" placeholder="Tell the story behind this piece..." style={inputStyle} onChange={handleChange} required />
              </div>
            </div>

            {/* Right Column: Image Upload */}
            <div style={uploadZoneStyle}>
              <label style={labelStyle}>Product Visuals</label>
              <div style={dropBoxStyle}>
                {preview ? (
                  <img src={preview} alt="preview" style={previewImageStyle} />
                ) : (
                  <div style={{ textAlign: "center", color: "#94a3b8" }}>
                    <p style={{ fontSize: "40px", margin: "0" }}>🏺</p>
                    <p style={{ fontWeight: "600" }}>Upload Photo</p>
                    <p style={{ fontSize: "12px" }}>Show the beauty of your craft</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImage} style={fileInputStyle} required={!preview} />
              </div>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "10px" }}>
                Supported formats: JPG, PNG. Max size: 5MB.
              </p>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} style={{
            ...submitButtonStyle,
            backgroundColor: isSubmitting ? "#94a3b8" : "#0d9488" 
          }}>
            {isSubmitting ? "Connecting to Workshop..." : "Publish Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Styles ---
const formContainerStyle = {
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "24px",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  maxWidth: "900px",
  width: "100%",
  border: "1px solid #f1f5f9"
};

const pageWrapperStyle = {
  display: "flex",
  justifyContent: "center", 
  alignItems: "center",     
  minHeight: "100vh",       
  backgroundColor: "#f8fafc", 
  padding: "20px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1.2fr 0.8fr",
  gap: "30px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "700",
  fontSize: "13px",
  color: "#334155",
  textTransform: "uppercase",
  letterSpacing: "0.025em"
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  fontSize: "15px",
  backgroundColor: "#f8fafc",
  outline: "none",
  boxSizing: "border-box",
};

const uploadZoneStyle = {
  display: "flex",
  flexDirection: "column",
};

const dropBoxStyle = {
  flex: 1,
  border: "2px dashed #cbd5e1",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  minHeight: "300px",
  backgroundColor: "#f8fafc",
  cursor: "pointer",
  overflow: "hidden",
  transition: "all 0.2s"
};

const fileInputStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  opacity: 0,
  cursor: "pointer",
};

const previewImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const submitButtonStyle = {
  marginTop: "30px",
  width: "100%",
  padding: "18px",
  color: "white",
  border: "none",
  borderRadius: "16px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "all 0.2s",
};

export default AddProduct;