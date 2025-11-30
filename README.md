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

# Frontend Configuration (Optional)
# Point this to your live backend URL when deploying the frontend
API_URL=http://localhost:5000/api

# AI Configuration
API_KEY=your_google_gemini_api_key
```

### 2. Backend Setup
The backend handles authentication, database connections, and API routes.

```bash
# 1. Navigate to the root (or backend folder if you structure it that way)
# 2. Install backend dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken

# 3. Start the server
node backend/server.js
```
*The server will run on `http://localhost:5000`*

### 3. Frontend Setup
To run the frontend locally using a modern build tool like **Vite**:

1.  **Initialize Project:**
    ```bash
    npm create vite@latest client -- --template react-ts
    cd client
    ```

2.  **Install Frontend Dependencies:**
    You need to install the libraries used in the code:
    ```bash
    npm install axios @reduxjs/toolkit react-redux lucide-react recharts react-markdown @google/genai
    ```

3.  **Setup Tailwind CSS:**
    If you are not using the CDN method (recommended for production), install Tailwind locally:
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
    *Configure your `tailwind.config.js` to scan your src files.*

4.  **Add The Code:**
    - Copy the `components`, `services`, `store`, `context`, `App.tsx`, `constants.tsx`, and `types.ts` files into your `src` folder.
    - Ensure your `main.tsx` (or `index.tsx`) wraps the App in the Redux `Provider` and `ThemeProvider`.

5.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    *The frontend will typically run on `http://localhost:5173`. Open this URL in your browser.*

---

## ☁️ Deployment

### Deploying the Backend
You can deploy the `backend` folder to services like **Render**, **Heroku**, or **Railway**.
1.  Set the environment variables (`MONGODB_URI`, `JWT_SECRET`) in your hosting provider's dashboard.
2.  The server listens on `process.env.PORT`.

### Deploying the Frontend
You can deploy the frontend to **Vercel**, **Netlify**, or AWS S3.
1.  **Build Command:** `npm run build`
2.  **Environment Variables:** If your backend is hosted separately (e.g., on Render), you **must** set the `API_URL` environment variable in your frontend hosting dashboard.
    *   Example: `API_URL=https://my-trademind-api.onrender.com/api`
3.  **CORS:** Ensure your backend handles CORS (Cross-Origin Resource Sharing) correctly for your frontend's domain.

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

## 📄 License
MIT
