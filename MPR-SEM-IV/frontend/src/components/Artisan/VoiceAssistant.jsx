import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  const playGuide = () => {
    const text = "Hello Artisan! To upload your handicraft, click on the Add Product button in the sidebar. You can also monitor your total revenue and recent orders on this dashboard.";
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = 0.9; 
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={containerStyle}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={panelStyle}
          >
            <div style={headerStyle}>
              <span>🎤 Voice Assistant</span>
              <button onClick={() => setIsOpen(false)} style={closeBtn}>×</button>
            </div>
            
            <div style={contentStyle}>
              <p style={welcomeText}>Hello Artisan!</p>
              <p style={subText}>Click the button below to hear instructions.</p>
              
              <button 
                onClick={playGuide} 
                style={playBtn}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f0fdfa'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f1f5f9'}
              >
                ▶ Play Guide
              </button>

              <div style={tipBox}>
                <p style={tipText}>
                  <strong style={{ color: '#0d9488' }}>Tip:</strong> Click "Add Product" to upload your handicraft.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button - Updated to Teal */}
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: '#0f766e' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={floatingBtnStyle}
      >
        🎤 {isOpen ? "Close Guide" : "Voice Assistant for Help"}
      </motion.button>
    </div>
  );
};

// --- STYLES ---

const containerStyle = {
  position: 'fixed',
  bottom: '30px',
  right: '30px',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '15px'
};

const floatingBtnStyle = {
  padding: '12px 24px',
  backgroundColor: '#0d9488', // Teal 600
  color: 'white',
  border: 'none',
  borderRadius: '30px',
  boxShadow: '0 10px 25px rgba(13, 148, 136, 0.3)',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px',
  transition: 'background-color 0.2s'
};

const panelStyle = {
  width: '300px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
  border: '1px solid #e2e8f0',
  overflow: 'hidden'
};

const headerStyle = {
  padding: '15px',
  backgroundColor: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
  display: 'flex',
  justifyContent: 'space-between',
  fontWeight: 'bold',
  color: '#0d9488' // Teal Header Text
};

const contentStyle = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const welcomeText = { margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1e293b' };
const subText = { margin: 0, fontSize: '14px', color: '#64748b' };

const playBtn = {
  padding: '10px',
  backgroundColor: '#f1f5f9',
  border: '1px solid #0d9488', // Teal border
  color: '#0d9488',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  marginTop: '10px',
  transition: 'all 0.2s'
};

const tipBox = {
  marginTop: '15px',
  padding: '12px',
  backgroundColor: '#f0fdfa', // Very light teal background
  borderRadius: '10px',
  border: '1px solid #99f6e4' // Teal 200 border
};

const tipText = { margin: 0, fontSize: '13px', color: '#134e4a', lineHeight: '1.4' };
const closeBtn = { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' };

export default VoiceAssistant;