import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('hi');
  const [audioElement, setAudioElement] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Safely grab your Vite environment variable
  // Remove the import.meta.env line temporarily and paste your raw key here:
const ELEVENLABS_API_KEY ="sk_f7478a1b6496746fe797738f5be1f52d2895736639d1ccbb";

  useEffect(() => {
    const audio = new Audio();
    audio.onplaying = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onpause = () => setIsPlaying(false);
    setAudioElement(audio);

    return () => {
      audio.pause();
    };
  }, []);

  // Updated with standard global voices guaranteed to support multilingual text synthesis
  const languages = {
    'hi': {
      name: 'हिंदी (Hindi)',
      voiceId: 'mC46XEA1mwoEY0xbLl1c', // Adam (Pre-made multilingual voice)
      text: `ArtLink में आपका स्वागत है! यह आपका अपना पैनल है जहाँ से आप अपनी दुकान चला सकते हैं। पहला, 'होम डैशबोर्ड' पर आप अपनी दुकान का स्टेटस और कुल ऑर्डर्स देख सकते हैं। दूसरा, अपना नया सामान अपलोड करने के लिए 'Add / My Products' बटन का इस्तेमाल करें। तीसरा, 'New Orders' सेक्शन में आपको ग्राहकों के सभी ऑर्डर्स दिखाई देंगे।`
    },
    'en': {
      name: 'English',
      voiceId: 'mC46XEA1mwoEY0xbLl1c', // Rachel (Pre-made English/Multilingual)
      text: `Welcome to ArtLink! This is your artisan panel. First, the Home Dashboard shows your active shop status and total orders. Second, use the 'Add / My Products' button to upload new handicrafts with names and prices. Third, the 'New Orders' section tracks your sales; please check 'Pending Orders' regularly.`
    },
    'bn': {
      name: 'বাংলা (Bengali)',
      voiceId: 'mC46XEA1mwoEY0xbLl1c', // Adam
      text: `ArtLink-এ আপনাকে স্বাগতম! এটি আপনার কারিগর প্যানেল যেখান থেকে আপনি আপনার দোকান পরিচালনা করতে পারবেন। প্রথমত, 'হোম ড্যাশবোর্ড' আপনার সক্রিয় দোকানের স্থিতি এবং মোট অর্ডার দেখায়। দ্বিতীয়ত, নাম এবং দাম সহ নতুন হস্তশিল্প আপলোড করতে 'Add / My Products' বোতামটি ব্যবহার করুন।`
    },
    'mr': {
      name: 'मराठी (Marathi)',
      voiceId: 'mC46XEA1mwoEY0xbLl1c', // Adam
      text: `ArtLink मध्ये आपले स्वागत आहे! हे तुमचे कारागीर पॅनेल आहे जिथून तुम्ही तुमचे दुकान चालवू शकता। पहिले, 'होम डॅशबोर्ड' तुमच्या दुकानाची स्थिती आणि एकूण ऑर्डर्स दाखवतो। दुसरे, नवीन हस्तकला वस्तू अपलोड करण्यासाठी 'Add / My Products' बटण वापरा।`
    },
    'ta': {
      name: 'தமிழ் (Tamil)',
      voiceId: 'mC46XEA1mwoEY0xbLl1c', // Adam
      text: `ArtLink-உங்களை அன்புடன் வரவேறுகிறார்! यह உங்கள் கைவினைஞர் பேனல் ஆகும். முதலாவதாக, 'ஹோம் டேஷ்போர்டு' உங்கள் கடையின் நிலை மற்றும் மொத்த ஆர்டர்களைக் காட்டுகிறது. இரண்டாவதாக, புதிய கைவினைப் பொருட்களைப் பதிவேற்ற 'Add / My Products' பொத்தானைப் பயன்படுத்தவும்.`
    }
  };

  const playGuide = async () => {
    if (!audioElement) return;

    if (isPlaying) {
      stopSpeech();
      return;
    }

    if (!ELEVENLABS_API_KEY) {
      console.error("ElevenLabs API Key is missing. Check your .env setup.");
      alert("Configuration Error: API key not detected in your environment (.env).");
      return;
    }

    const currentLangData = languages[selectedLang];
    if (!currentLangData) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${currentLangData.voiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: currentLangData.text,
            model_id: 'eleven_multilingual_v2', 
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        // Capture specific ElevenLabs response message (e.g., tier limits, incorrect key)
        const errorData = await response.json().catch(() => ({}));
        console.error("ElevenLabs Server Error Payload:", errorData);
        throw new Error(`Status ${response.status}: ${errorData.detail?.message || response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      audioElement.src = audioUrl;
      audioElement.load();
      audioElement.play();
    } catch (error) {
      console.error("Failed to stream ElevenLabs AI audio:", error);
      alert(`API Error: ${error.message}. Right-click -> Inspect -> Console for full system details.`);
    } finally {
      setIsLoading(false);
    }
  };

  const stopSpeech = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
    }
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
              <span>🎤 Voice Assistant / सहायक</span>
              <button onClick={() => { stopSpeech(); setIsOpen(false); }} style={closeBtn}>×</button>
            </div>
            
            <div style={contentStyle}>
              <p style={welcomeText}>Hello Artisan! / नमस्ते!</p>
              <p style={subText}>Choose your language to hear the setup tour guidelines:</p>
              
              <select 
                value={selectedLang} 
                onChange={(e) => {
                  stopSpeech(); 
                  setSelectedLang(e.target.value);
                }}
                style={dropdownStyle}
                disabled={isLoading}
              >
                {Object.keys(languages).map((code) => (
                  <option key={code} value={code}>
                    {languages[code].name}
                  </option>
                ))}
              </select>

              <button 
                onClick={playGuide} 
                style={{
                  ...playBtn,
                  backgroundColor: isLoading ? '#e2e8f0' : isPlaying ? '#fecaca' : '#f1f5f9',
                  borderColor: isLoading ? '#cbd5e1' : isPlaying ? '#ef4444' : '#0d9488',
                  color: isLoading ? '#94a3b8' : isPlaying ? '#b91c1c' : '#0d9488',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                disabled={isLoading}
              >
                {isLoading ? "⌛ Generating AI Voice..." : isPlaying ? "⏹ Stop Tour / गाइड रोकें" : "▶ Start Tour / गाइड शुरू करें"}
              </button>

              <div style={tipBox}>
                <p style={tipText}>
                  <strong style={{ color: '#0d9488' }}>Tip:</strong> "Add Product" पर क्लिक करके अपना सामान अपलोड करें और अपनी बिक्री बढ़ाएं।
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: '#0f766e' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (isOpen) stopSpeech(); 
          setIsOpen(!isOpen);
        }}
        style={floatingBtnStyle}
      >
        🎤 {isOpen ? "Close Guide" : "Voice Assistant for Help"}
      </motion.button>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' };
const floatingBtnStyle = { padding: '12px 24px', backgroundColor: '#0d9488', color: 'white', border: 'none', borderRadius: '30px', boxShadow: '0 10px 25px rgba(13, 148, 136, 0.3)', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'background-color 0.2s' };
const panelStyle = { width: '320px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 15px 35px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', overflow: 'hidden' };
const headerStyle = { padding: '15px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#0d9488' };
const contentStyle = { padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' };
const welcomeText = { margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1e293b' };
const subText = { margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' };
const dropdownStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '14px', color: '#334155', outline: 'none' };
const playBtn = { padding: '12px', border: '1px solid', borderRadius: '8px', fontWeight: '600', marginTop: '5px', transition: 'all 0.2s' };
const tipBox = { marginTop: '10px', padding: '12px', backgroundColor: '#f0fdfa', borderRadius: '10px', border: '1px solid #99f6e4' };
const tipText = { margin: 0, fontSize: '13px', color: '#134e4a', lineHeight: '1.4' };
const closeBtn = { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' };

export default VoiceAssistant;