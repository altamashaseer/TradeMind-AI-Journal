# TradeMind AI Journal 📈🤖

TradeMind is a professional-grade trading journal application powered by the MERN stack and Google Gemini AI. It helps traders track their performance, analyze their psychology, and get automated technical feedback on their trade setups.

## 🌟 Features

### 📊 Dashboard & Analytics
- **Performance Metrics:** Real-time calculation of Win Rate, Net PnL, Profit Factor, and Average Win/Loss.
- **Equity Curve:** Visual representation of your account growth over time.
- **Visual Stats:** Interactive charts and KPI cards.

### 📝 Trade Journaling
- **Detailed Logging:** Record Instrument, Date, Direction (Long/Short), Outcome, PnL, Strategy/Setup, and Notes.
- **Screenshot Support:** Upload chart screenshots (Base64 encoded) to visually review setups.
- **CRUD Operations:** Full ability to Create, Read, Update, and Delete trades.
- **Filtering:** Filter trades by Outcome (Win, Loss, Break Even).

### 🧠 AI Coach (Powered by Gemini 2.5)
- **Automated Analysis:** Click "Generate Insight" on any trade to have Gemini analyze your setup and notes.
- **Psychological Feedback:** Receives coaching on your mental state based on your trade notes.
- **Technical Review:** The AI analyzes the trade parameters to offer technical improvement tips.

### 🎨 UI/UX
- **Dark/Light Mode:** Fully responsive theme toggling.
- **Responsive Design:** Works seamlessly on Desktop and Mobile.
- **Modern Styling:** Built with Tailwind CSS for a clean, financial-terminal aesthetic.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Redux Toolkit, Recharts, Lucide Icons.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (via Mongoose).
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt.
- **AI Integration:** Google GenAI SDK (Gemini 2.5 Flash).
- **HTTP Client:** Axios.

---

## 🚀 Getting Started

### Prerequisites
1.  **Node.js** (v16 or higher)
2.  **MongoDB** (Local or Atlas Connection URI)
3.  **Google Gemini API Key** (Get one at [aistudio.google.com](https://aistudiocdn.com/))

### 1. Environment Configuration
Create a `.env` file in the root directory.

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/trademind

# Security
JWT_SECRET=your_super_secret_random_string

# Backend Configuration
PORT=5000

# AI Configuration
API_KEY=your_google_gemini_api_key

# Optional: Set this if deploying frontend separately
# API_URL=https://your-api-url.com/api
```

### 2. Backend Setup
The backend handles authentication, database connections, and API routes.

```bash
# 1. Navigate to the root
# 2. Install backend dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken

# 3. Start the server
node backend/server.js
```

### 3. Frontend Setup
To run the frontend locally:

```bash
# Initialize Vite (if not already done)
npm create vite@latest client -- --template react-ts
cd client
npm install axios @reduxjs/toolkit react-redux lucide-react recharts react-markdown @google/genai

# Run Development Server
npm run dev
```

---

## ☁️ Deployment Guide

You can deploy this app in two ways: **Unified** (simpler) or **Separate** (more scalable).

### Option A: Unified Deployment (Recommended for ease)
Host both Frontend and Backend on the same server (e.g., Render, Railway, Heroku). The Node.js server will serve the API *and* the React frontend.

1.  **Build Frontend:**
    Inside your `client` folder, run:
    ```bash
    npm run build
    ```
    This creates a `dist` folder.

2.  **Organize Folders:**
    Ensure your structure looks like this:
    ```
    /root
      /backend
      /client
        /dist  <-- The built files go here
    ```

3.  **Deploy:**
    Push the entire root to your host. 
    Start command: `NODE_ENV=production node backend/server.js`
    
    *The app will automatically serve the frontend at your domain `your-app.com` and the API at `your-app.com/api`.*

### Option B: Separate Deployment
Host Frontend on **Vercel/Netlify** and Backend on **Render/Railway**.

1.  **Backend:** Deploy the `backend` folder. Get the URL (e.g., `https://my-api.onrender.com`).
2.  **Frontend:** Deploy the `client` folder.
3.  **Connect:** In your Vercel/Netlify dashboard, set the Environment Variable:
    ```
    API_URL=https://my-api.onrender.com/api
    ```
    *The frontend will now know where to send requests.*

---

## 📂 Project Structure

```
├── backend/
│   ├── models/         # Mongoose Schemas (User, Trade)
│   └── server.js       # Express App & API Routes
├── components/         # React UI Components
├── context/            # React Context (Theme)
├── services/           # API Logic
├── store/              # Redux Toolkit Store
├── App.tsx             # Main Layout & Routing
└── index.tsx           # Entry Point
```
