import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Pre-load voices for better reliability
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const playGuide = () => {
    window.speechSynthesis.cancel();

    // 1. Full English Script
    const engText = `Welcome to ArtLink! This is your artisan panel. 
      First, the Home Dashboard shows your active shop status and total orders. 
      Second, use the 'Add / My Products' button to upload new handicrafts with names and prices. 
      Third, the 'New Orders' section tracks your sales; please check 'Pending Orders' regularly. 
      I am here to help!`;

    // 2. Full Hindi Script
    const hindiText = `ArtLink में आपका स्वागत है! यह आपका अपना पैनल है जहाँ से आप अपनी दुकान चला सकते हैं। 
      पहला, 'होम डैशबोर्ड' पर आप अपनी दुकान का स्टेटस और कुल ऑर्डर्स देख सकते हैं। 
      दूसरा, अपना नया सामान अपलोड करने के लिए 'Add / My Products' बटन का इस्तेमाल करें; यहाँ आप सामान का नाम और दाम डाल सकते हैं। 
      तीसरा, 'New Orders' सेक्शन में आपको ग्राहकों के सभी ऑर्डर्स दिखाई देंगे। समय पर डिलीवरी के लिए 'Pending Orders' को ज़रूर चेक करें। 
      मदद के लिए मैं हमेशा यहाँ हूँ!`;

    const speak = (text, langCode) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      // Filter for the best voice match
      const targetVoice = voices.find(v => 
        v.lang.startsWith(langCode.split('-')[0]) || v.lang.includes(langCode)
      );

      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      utterance.lang = langCode;
      utterance.rate = 1.0; // Slightly faster for long text
      utterance.pitch = 1;
      
      window.speechSynthesis.speak(utterance);
    };

    // Queues both languages (English first, then Hindi)
    speak(hindiText, 'hi-IN');
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
              <span>🎤 Voice Assistant / आवाज़ सहायक</span>
              <button onClick={() => setIsOpen(false)} style={closeBtn}>×</button>
            </div>
            
            <div style={contentStyle}>
              <p style={welcomeText}>Hello Artisan! / नमस्ते!</p>
              <p style={subText}>Learn how to use your dashboard (English & हिंदी).</p>
              
              <button 
                onClick={playGuide} 
                style={playBtn}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f0fdfa'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f1f5f9'}
              >
                ▶ Start Full Tour / टूर शुरू करें
              </button>

              <div style={tipBox}>
                <p style={tipText}>
                  <strong style={{ color: '#0d9488' }}>Tip:</strong> "Add Product" पर क्लिक करके अपना सामान अपलोड करें और अपनी बिक्री बढ़ाएं।
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

// --- STYLES (Minimalist Teal Aesthetic) ---
const containerStyle = { position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' };
const floatingBtnStyle = { padding: '12px 24px', backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '30px', boxShadow: '0 10px 25px rgba(13, 148, 136, 0.3)', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'background-color 0.2s' };
const panelStyle = { width: '320px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', overflow: 'hidden' };
const headerStyle = { padding: '15px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#0d9488' };
const contentStyle = { padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' };
const welcomeText = { margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1e293b' };
const subText = { margin: 0, fontSize: '14px', color: '#64748b', lineHeight: '1.4' };
const playBtn = { padding: '12px', backgroundColor: '#f1f5f9', border: '1px solid #0d9488', color: '#0d9488', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '5px' };
const tipBox = { marginTop: '10px', padding: '12px', backgroundColor: '#f0fdfa', borderRadius: '10px', border: '1px solid #99f6e4' };
const tipText = { margin: 0, fontSize: '13px', color: '#134e4a', lineHeight: '1.4' };
const closeBtn = { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' };

export default VoiceAssistant;