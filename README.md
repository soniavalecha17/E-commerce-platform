🎨 ArtLink – Empowering Rural Artisans

ArtLink is a full-stack MERN marketplace platform designed to bridge the digital divide by connecting rural artisans directly with a global customer base. The platform enables artisans to showcase their craftsmanship, manage their storefronts, and track business performance, while providing customers with a seamless, accessible shopping experience.

🚀 Key Features
* **Role-Based Access:** Dedicated dashboards for Customers, Artisans, and Admins.
* **Marketplace Management:** Intuitive tools for product uploads, advanced search, filtering, and cart management.
* **Secure E-Commerce:** Integrated Razorpay for payments, along with a robust ratings, reviews, and order tracking system.
* **Artisan Insights:** A comprehensive analytics dashboard to track revenue, product performance, and customer feedback.
* **Inclusive Accessibility:** Multilingual Voice Assistance powered by the ElevenLabs API for users in rural areas.
* **Security:** Industry-standard authentication using JWT with protected route authorization.

🛠 Tech Stack
* **Frontend:** React.js, JavaScript, HTML5, CSS3
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Security:** JWT (JSON Web Token)
* **Integrations:** Razorpay API, ElevenLabs API

🏗 System Architecture
The platform follows a standard MERN architecture where client interfaces communicate with the Node/Express API, which interacts with the MongoDB database.
External Services:Razorpay API for transactions and ElevenLabs API for voice-driven accessibility.

## ⚙️ Installation
1. Clone the Repository**

```bash
git clone https://github.com/yourusername/artlink.git
```
2. Navigate to Project**
```bash
cd artlink
```
3. Install Dependencies**
```bash
npm install
cd backend
npm install
```
4. Configure Environment Variables**
Create a `.env` file in the `backend` directory with the following keys:
* `MONGO_URI`
* `JWT_SECRET`
* `RAZORPAY_KEY_ID`
* `RAZORPAY_SECRET`
* `ELEVENLABS_API_KEY`
**5. Run the Application**
* **Backend:** `npm start`
* **Frontend:** `npm start` (from the root or client directory)
  
🎯 Future Enhancements
* Live Cloud Deployment
* AI-driven Product Recommendations
* Native Mobile Application
* Full Multi-language Localization

👨‍💻Contributors
Sonia Valecha
Meghna Vasyani

📬Contact

LinkedIn: [Your LinkedIn Profile]
GitHub:[Your GitHub Profile]

---

### Final Checklist for your GitHub Repo:

1. **Repository Visibility:** Ensure it is set to "Public" so recruiters can view it.
2. **Add a `LICENSE` file:** It's good practice for professional repos (the MIT License is standard).
3. **Add a `.gitignore`:** Ensure your `node_modules` and `.env` files are in your `.gitignore` so you don't accidentally push your secrets to GitHub!

**Everything looks ready to go! Are you planning on deploying this to a service like Vercel or Render soon?**
