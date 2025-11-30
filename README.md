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
Create a `.env` file in the root directory. You can configure the API URL to point to a remote server for production.

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/trademind

# Security
JWT_SECRET=your_super_secret_random_string

# Backend Configuration (Port for the Node.js server)
PORT=5000

# Frontend Configuration (Optional - Defaults to http://localhost:5000/api if empty)
# Use this when deploying the frontend to a different domain than the backend
API_URL=http://localhost:5000/api

# AI Configuration
API_KEY=your_google_gemini_api_key
```

### 2. Backend Setup
The backend handles authentication and database operations.

```bash
# Install dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken

# Start the server
node backend/server.js
```
*The server will run on `http://localhost:5000`*

### 3. Frontend Setup
The frontend is built using ES Modules.

1.  Ensure the backend is running.
2.  Start your frontend development server.
3.  **Sign Up:** Create a new account to start logging trades.

---

## ☁️ Deployment

### Deploying the Backend
You can deploy the `backend` folder to services like **Render**, **Heroku**, or **Railway**.
1.  Set the environment variables (`MONGODB_URI`, `JWT_SECRET`) in your hosting provider's dashboard.
2.  The server listens on `process.env.PORT`.

### Deploying the Frontend
You can deploy the frontend to **Vercel**, **Netlify**, or AWS S3.
1.  If your backend is hosted separately (e.g., on Render), you must set the `API_URL` environment variable during the frontend build process to point to your backend.
    *   Example: `API_URL=https://my-trademind-backend.onrender.com/api`
2.  Ensure your backend handles CORS (Cross-Origin Resource Sharing) correctly if the domains differ. The provided `server.js` enables CORS for all origins by default.

---

## 📂 Project Structure

```
├── backend/
│   ├── models/         # Mongoose Schemas (User, Trade)
│   └── server.js       # Express App & API Routes
├── components/         # React UI Components
│   ├── Auth.tsx        # Login/Signup Forms
│   ├── Dashboard.tsx   # Charts & Stats
│   ├── TradeDetail.tsx # Individual Trade View + AI
│   ├── TradeForm.tsx   # Add/Edit Modal
│   └── TradeList.tsx   # Filterable Grid View
├── context/            # React Context (Theme)
├── services/           # API Logic
│   ├── api.ts          # Axios setup & Interceptors
│   └── geminiService.ts# AI Integration logic
├── store/              # Redux Toolkit Store
│   ├── authSlice.ts    # User State
│   └── tradeSlice.ts   # Trade Data State
├── App.tsx             # Main Layout & Routing
└── index.tsx           # Entry Point
```

## 🔒 Security Note
- Passwords are hashed using `bcrypt` before storage.
- API requests are protected via JWT Bearer tokens.
- **Note:** For a production deployment, ensure you implement strict CORS policies and secure HTTP headers.

---

## 🤖 AI Prompt Engineering
The application uses a specialized prompt located in `services/geminiService.ts` to instruct the model to act as a "Trading Psychologist and Technical Analyst," ensuring feedback is constructive and context-aware.

## 📄 License
MIT