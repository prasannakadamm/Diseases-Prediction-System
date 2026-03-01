# AI-Based Disease Prediction & Health Risk Assessment System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Node](https://img.shields.io/badge/Node-Express-green)
![Python](https://img.shields.io/badge/Python-FastAPI-yellow)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

A complete, production-ready Healthcare AI SaaS platform that predicts diseases based on patient symptoms using a Machine Learning model (Random Forest Classifier). The system provides users with probable conditions, risk levels, recommended specialists, actionable precautions, and downloadable PDF reports. 

Built with modern MERN stack architecture, Tailwind CSS Glassmorphism aesthetics, and a Python FastAPI backend for prediction calculation.

## 🚀 Key Features

*   **Intelligent Prediction Engine**: Synthetic datasets trained across 11 major diseases with > 90% accuracy.
*   **Animated UI Engine**: Framer Motion and Tailwind CSS custom animations.
*   **RBAC Security**: JWT authorization for Users & Admins securely managed via Context API.
*   **Analytics Dashboard**: Data aggregation for platform administrators.
*   **Dark/Light Mode**: Smooth system-wide theme transitions using context providers.
*   **Exportable Reports**: Auto-generated PDF creation using jsPDF.

## 📸 Application Gallery

Here are some visual representations of the platform in action, showcasing the UI/UX and analytical dashboard:

**1. Main Dashboard & Analytics**
![Dashboard](./Screenshots/Dashboard%2001.png)

**2. AI Prediction Interface**
![Assessment Page](./Screenshots/Predict%20Diseases%2001.png)

**3. Administrator Controls**
![Admin Panel](./Screenshots/Admin%20Panel%2001.png)

**4. User Profile & Settings**
![User Config](./Screenshots/Profile%20.png)

## 📁 Repository Structure

```
/
├── Backend/                 # Express REST API
│   ├── models/              # Mongoose DB Schemas
│   ├── routes/              # Auth, Predict, Admin endpoints
│   ├── middleware/          # JWT protection
│   └── server.js            # Node Entry Point
├── Frontend/                # Vite React App
│   ├── src/
│   │   ├── components/      # UI Reusables (Navbar, Cards)
│   │   ├── context/         # Auth, Theme
│   │   ├── pages/           # Dashboard, Login, Register, Predict
│   │   └── App.jsx          # React Router Configuration
├── ML_Model/                # Machine Learning Microservice
│   ├── train_model.py       # Random Forest generation
│   ├── generate_dataset.py  # Script for synthetic medical info
│   └── app.py               # FastAPI Controller
└── Docs/                    # Technical & Academic Project Report
```

## 🛠️ Installation & Setup

1. **Clone the project & Navigate to the workspace:**
   ```bash
   cd "DISEASE PREDICTION SYSTEM Web Application"
   ```

2. **MongoDB Setup:**
   - Install MongoDB locally, or use MongoDB Atlas.
   - Copy `Backend/.env.sample` to `Backend/.env`. Add your MongoDB URI.

3. **Backend Initialization:**
   ```bash
   cd Backend
   npm install
   npm run dev
   ```
   *Runs on `http://localhost:5000`*

4. **Machine Learning API Initialization:**
   ```bash
   cd ML_Model
   python -m venv venv
   .\venv\Scripts\activate
   pip install pandas scikit-learn numpy fastapi uvicorn pydantic
   python generate_dataset.py
   python train_model.py
   uvicorn app:app --reload --port 8000
   ```
   *Runs on `http://localhost:8000`*

5. **Frontend Initialization:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```
   *Runs on standard Vite port (`http://localhost:5173` typically)*

## 🌍 Deployment Strategy

*   **Frontend**: Push to **Vercel** (`npm run build` as build command, `dist` as output directory).
*   **Backend**: Push to **Render** or **Railway**. Set Environment Variables.
*   **ML API**: Deploy via **Render** as a Python Web Service, or **Heroku**. Set build command to `pip install -r requirements.txt` and start command `uvicorn app:app --host 0.0.0.0 --port $PORT`.
*   **Database**: Utilize **MongoDB Atlas** cluster. Share URI to `.env` of the Backend.

## 🤝 Contribution & License
Academic internal project by default. MIT License.
