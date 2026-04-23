# CardioNeuro AI — StrokeNova
## Complete Project Explanation for Presentation

---

## 1. Project Overview

**CardioNeuro AI (StrokeNova)** is a full-stack web application that predicts **Stroke Risk** and **Heart Disease Risk** using Machine Learning. It provides:

- Real-time risk predictions based on patient health parameters
- **Explainable AI (XAI)** using SHAP values to show *why* a prediction was made
- Personalized health recommendations
- Prediction history tracking and analytics
- Admin dashboard for system monitoring

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js + Vite |
| **Backend** | Python Flask (REST API) |
| **Database** | MongoDB Atlas (Cloud) |
| **ML Model** | Random Forest Classifier (scikit-learn) |
| **Explainability** | SHAP (SHapley Additive exPlanations) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Deployment** | Render (Single-service) |
| **Charts** | Recharts (React charting library) |

---

## 3. Machine Learning Model

### 3.1 Algorithm Used: **Random Forest Classifier**

Random Forest is an **ensemble learning** method that:
- Creates multiple decision trees during training
- Each tree votes on the final prediction
- The majority vote determines the output (stroke/no stroke)

**Why Random Forest?**
- Handles both numerical and categorical data well
- Resistant to overfitting
- Provides feature importance scores
- Works well with imbalanced datasets (stroke cases are rare)

### 3.2 Training Data

The model was trained on the **WHO Stroke Prediction Dataset** containing ~5,000 patient records.

### 3.3 Input Features (What Values Are Taken)

The prediction form collects these **10 health parameters**:

| # | Feature | Type | Example Values |
|---|---------|------|---------------|
| 1 | **Gender** | Categorical | Male, Female |
| 2 | **Age** | Numerical | 25, 45, 67 |
| 3 | **Hypertension** | Binary | Yes (1) / No (0) |
| 4 | **Heart Disease** | Binary | Yes (1) / No (0) |
| 5 | **Ever Married** | Categorical | Yes / No |
| 6 | **Work Type** | Categorical | Private, Self-employed, Govt, Children, Never Worked |
| 7 | **Residence Type** | Categorical | Urban / Rural |
| 8 | **Average Glucose Level** | Numerical | 70–280 mg/dL |
| 9 | **BMI** | Numerical | 10–60 kg/m² |
| 10 | **Smoking Status** | Categorical | Never Smoked, Formerly Smoked, Smokes |

### 3.4 Feature Encoding (How Categorical Data is Handled)

Since Random Forest needs numerical input, categorical features are **one-hot encoded**:

```
gender_Male         → 0 or 1
ever_married_Yes    → 0 or 1
work_type_Private   → 0 or 1
work_type_Self-employed → 0 or 1
...etc
```

This creates ~16 binary columns from the original 10 features.

### 3.5 Model Output

The model outputs:
- **Prediction**: 0 (No Stroke Risk) or 1 (Stroke Risk)
- **Probability**: A decimal between 0.0 and 1.0 (e.g., 0.32 = 32% risk)

### 3.6 Risk Classification

| Probability Range | Risk Level | Color |
|-------------------|-----------|-------|
| **0% – 29%** | Low Risk | 🟢 Green |
| **30% – 59%** | Medium Risk | 🟡 Yellow |
| **60% – 100%** | High Risk | 🔴 Red |

---

## 4. Explainable AI — SHAP Values

### 4.1 What is SHAP?

**SHAP (SHapley Additive exPlanations)** is a method to explain *individual predictions*. It tells you:
- **Which features** contributed most to the prediction
- **How much** each feature pushed the risk up or down

### 4.2 How It Works

For each prediction, SHAP calculates a **contribution value** for every feature:
- **Positive SHAP value** → Feature **increases** stroke risk (shown in red)
- **Negative SHAP value** → Feature **decreases** stroke risk (shown in green)

### 4.3 Example

For a patient with high BMI and smoking history:
```
Body Mass Index:  +0.08  (increases risk ↑)
Smoking Impact:   +0.05  (increases risk ↑)
Blood Glucose:    +0.03  (increases risk ↑)
Hypertension:     -0.01  (decreases risk ↓)
Heart Disease:    -0.02  (decreases risk ↓)
```

---

## 5. Application Pages & Functionality

### 5.1 Landing Page (`/`)
- Hero section with app branding
- Call-to-action buttons for Login/Signup
- Feature highlights

### 5.2 Signup Page (`/signup`)
- Fields: Username, Email, Password, Confirm Password
- Password validation (minimum length, special characters)
- Creates account in MongoDB Atlas
- Passwords are hashed using **Werkzeug** (bcrypt-like hashing)

### 5.3 Login Page (`/login`)
- Fields: Email, Password
- Returns a **JWT token** valid for 1 hour
- Token is stored in `localStorage` for subsequent API calls

### 5.4 Predict Page (`/predict`) ⭐ Core Feature
- **Step-by-step chat-like interface** — asks one question at a time
- Animated typing effect for each question
- Progress bar shows completion percentage
- After all 10 inputs are collected:
  1. Data is sent to Flask API (`POST /api/predict/`)
  2. Backend loads the trained Random Forest model
  3. Model makes prediction + calculates SHAP values
  4. Returns: probability, risk level, SHAP values, suggestions
- **Result display shows**:
  - Risk level (Low/Medium/High with color)
  - Probability percentage
  - Personalized health suggestions from the ML model
  - SHAP Feature Importance chart (horizontal bar chart)
  - Share & Print buttons

### 5.5 Dashboard Page (`/dashboard`) ⭐ Main Hub
- **Risk Cards**: Shows Heart Risk and Stroke Risk percentages from the latest prediction
- **Feature Contribution Chart**: SHAP values from the latest prediction as a horizontal bar chart
- **Preventive Recommendations**: ML-generated suggestions or default health tips
- **Previous Predictions Sidebar**: Last 5 predictions with risk level badges
- **Navigation Sidebar**: Links to all pages
- **Admin Panel link**: Only visible for admin users

### 5.6 History Page (`/history`)
- **Full prediction history** with all past predictions
- Each card shows:
  - Date & time
  - Risk percentage and level badge
  - Patient details (Age, Gender, BMI, Glucose)
  - Medical history (Hypertension, Heart Disease, Smoking)
- **Search**: Filter by age, BMI, gender, date
- **Filter**: By risk level (All/Low/Medium/High)
- **Export CSV**: Download all predictions as a CSV file
- **Delete**: Remove individual predictions
- **Share**: Share prediction via link

### 5.7 Profile Page (`/profile`)
- View account details (username, email)
- Account creation date
- Total predictions count

### 5.8 Health Tips Page (`/health-tips`)
- General cardiovascular health advice
- Diet, exercise, and lifestyle recommendations

### 5.9 Analytics Page (`/analytics`)
- Charts showing prediction trends over time
- Risk distribution analysis

### 5.10 Admin Dashboard (`/admin`) — Admin Only
- Total users count
- Total predictions count
- System health metrics
- Recent user activity

---

## 6. Backend Architecture

### 6.1 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Create new account |
| POST | `/api/login` | Login, returns JWT |
| GET | `/api/profile` | Get user profile |
| POST | `/api/predict/` | Make stroke prediction |
| GET | `/api/history/` | Get prediction history |
| DELETE | `/api/history/<id>` | Delete a prediction |
| GET | `/api/share/<id>` | Get shared prediction |
| GET | `/api/analytics/` | Get analytics data |
| GET | `/api/admin/dashboard` | Admin stats |

### 6.2 File Structure

```
backend/
├── app.py              # Flask app entry point, serves frontend build
├── config.py           # MongoDB URI, JWT secrets
├── db.py               # Centralized MongoDB connection (Atlas + TLS)
├── auth.py             # Login, Signup, Profile routes
├── predictor_routes.py # /predict and /history API routes
├── admin_routes.py     # Admin dashboard data
├── models.py           # PredictionHistory model (MongoDB CRUD)
├── analytics.py        # Analytics query functions
├── security.py         # Rate limiting middleware
├── predictor/
│   ├── __init__.py
│   ├── ml_model.py     # Stroke prediction (loads stroke_model)
│   └── heart_model.py  # Heart prediction (loads heart_model)
└── requirements.txt    # Python dependencies
```

### 6.3 Database Schema (MongoDB)

**Users Collection:**
```json
{
  "_id": "ObjectId",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "role": "user",
  "created_at": "2026-04-23T00:00:00Z"
}
```

**Predictions Collection:**
```json
{
  "_id": "ObjectId",
  "user": "user_id",
  "gender": "Male",
  "age": 45,
  "hypertension": 1,
  "heart_disease": 0,
  "ever_married": "Yes",
  "work_type": "Private",
  "Residence_type": "Urban",
  "avg_glucose_level": 180.5,
  "bmi": 28.3,
  "smoking_status": "formerly smoked",
  "prediction": 1,
  "probability": 0.32,
  "shap_values": { "bmi": [0.01, 0.08], "hypertension": [-0.02, 0.05] },
  "suggestions": ["Monitor blood pressure regularly", "..."],
  "created_at": "2026-04-23T00:00:00Z"
}
```

---

## 7. Frontend Architecture

```
frontend/
├── index.html
├── vite.config.js        # Vite config + API proxy
├── src/
│   ├── App.jsx           # React Router setup
│   ├── pages/
│   │   ├── Landing.jsx       # Home/marketing page
│   │   ├── Auth.jsx          # Login page
│   │   ├── Signup.jsx        # Registration page
│   │   ├── DashboardHome.jsx # Main dashboard
│   │   ├── Predict.jsx       # Prediction form (chat UI)
│   │   ├── History.jsx       # Prediction history list
│   │   ├── Profile.jsx       # User profile
│   │   ├── HealthTips.jsx    # Health recommendations
│   │   └── Analytics.jsx     # Charts & trends
│   ├── components/
│   │   ├── SHAPVisualization.jsx  # SHAP bar chart component
│   │   ├── ShareModal.jsx         # Sharing modal
│   │   └── Header.jsx            # Navigation header
│   └── services/
│       └── api.js          # Axios HTTP client (JWT interceptor)
```

---

## 8. Security Features

| Feature | Implementation |
|---------|---------------|
| **Password Hashing** | Werkzeug `generate_password_hash` (PBKDF2) |
| **Authentication** | JWT tokens (1-hour expiry) |
| **Rate Limiting** | Custom middleware (prevents brute-force) |
| **CORS** | Flask-CORS (controls allowed origins) |
| **TLS/SSL** | Certifi CA bundle for MongoDB Atlas |
| **Input Validation** | Frontend + Backend validation |

---

## 9. Deployment on Render

### Build Process (`build.sh`):
1. Install Python backend dependencies (`pip install -r requirements.txt`)
2. Install Node.js frontend dependencies (`npm install`)
3. Build React app (`npm run build`)
4. Copy built static files to backend (`cp -r dist ../backend/dist`)

### Start Command:
```
cd backend && gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
```

### How It Works:
- Flask serves the React build as static files
- All `/api/*` routes go to Flask
- All other routes serve `index.html` (SPA client-side routing)
- Single service = one URL for everything

---

## 10. Data Flow — End to End

```
User fills form → React Frontend → POST /api/predict/ → Flask Backend
                                                            ↓
                                                    Load ML Model (joblib)
                                                            ↓
                                                    One-hot encode inputs
                                                            ↓
                                                    model.predict_proba()
                                                            ↓
                                                    Calculate SHAP values
                                                            ↓
                                                    Generate suggestions
                                                            ↓
                                                    Save to MongoDB Atlas
                                                            ↓
                                                    Return JSON response
                                                            ↓
React displays result ← { prediction, probability, shap_values, suggestions }
```

---

## 11. Key Highlights for Presentation

1. **Explainable AI**: Not just "you have 32% risk" — we show *why* through SHAP values
2. **Real-time predictions**: Sub-second inference using pre-trained models
3. **3-tier risk system**: Low (green), Medium (yellow), High (red) — clinically meaningful
4. **Interactive UI**: Chat-like prediction form with typing animations
5. **Full history**: Every prediction is saved and searchable
6. **CSV export**: Doctors can export patient data
7. **Sharing**: Predictions can be shared via unique links
8. **Cloud-native**: MongoDB Atlas + Render deployment
9. **Security**: JWT auth, password hashing, rate limiting
10. **Single-service deploy**: Frontend + Backend served from one URL
