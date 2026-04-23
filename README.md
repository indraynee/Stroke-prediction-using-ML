# CardioNeuro AI — Stroke Risk Prediction System

A full-stack web application that predicts **Stroke Risk** using Machine Learning with **Explainable AI (SHAP)** to show which health factors contribute most to the prediction.

🔗 **Live Demo**: [https://strokenova.onrender.com](https://strokenova.onrender.com)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Python Flask |
| Database | MongoDB Atlas |
| ML Model | Random Forest (scikit-learn) |
| Explainability | SHAP Values |
| Authentication | JWT |
| Deployment | Render |

## Project Structure

```
├── backend/          # Flask API + ML model
│   ├── app.py        # Entry point
│   ├── auth.py       # Login/Signup routes
│   ├── predictor/    # ML prediction logic
│   ├── models.py     # MongoDB models
│   └── db.py         # Database connection
├── frontend/         # React Vite app
│   └── src/
│       ├── pages/    # All page components
│       ├── components/
│       └── services/ # API client
├── stroke_model.pkl  # Trained ML model
└── render.yaml       # Deployment config
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js & npm
- MongoDB Atlas account (or local MongoDB)

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Mac/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

pip install -r requirements.txt
python app.py
```
Backend runs at `http://localhost:5000`

### 2. Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

### 3. Environment Variables

Create a `.env` file in `backend/` or set these environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | (required) |
| `JWT_SECRET_KEY` | Secret for JWT tokens | `your-secret-key` |
| `DB_NAME` | Database name | `cardioneuro` |

## Features

- **Stroke Risk Prediction** — Enter 10 health parameters, get instant risk assessment
- **Explainable AI** — SHAP values show which factors contribute to risk
- **3-Tier Risk System** — Low (green), Medium (yellow), High (red)
- **Prediction History** — Track all past predictions with search & filter
- **CSV Export** — Download prediction data
- **User Authentication** — Secure login/signup with JWT
- **Admin Dashboard** — System monitoring for admins
- **Responsive Design** — Works on desktop and mobile

## ML Model

- **Algorithm**: Random Forest Classifier
- **Dataset**: WHO Stroke Prediction Dataset (~5,000 records)
- **Input Features**: Gender, Age, Hypertension, Heart Disease, Marriage Status, Work Type, Residence, Glucose Level, BMI, Smoking Status
- **Output**: Stroke probability (0-100%) with SHAP feature contributions
