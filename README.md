# Full Stack React + Django + MongoDB App

This is a simple full-stack application with a Django backend (using MongoDB) and a React frontend.

## Prerequisites

- Python 3.8+
- Node.js & npm
- MongoDB (running locally on port 27017)

## Project Structure

- `backend/`: Django Project
- `frontend/`: React Vite Project

## Setup Instructions

### 1. Database Setup
Ensure your local MongoDB instance is running.
```bash
# Example if you have installed via brew or similar
mongod --dbpath /data/db
```

### 2. Backend Setup

Navigate to the `backend` directory:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run Migrations (Djongo requires this to sync with MongoDB):
```bash
python manage.py makemigrations
python manage.py migrate
```

Start the Server:
```bash
python manage.py runserver
```
The backend API will be available at `http://localhost:8000/api/`.

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the Development Server:
```bash
npm run dev
```
The frontend will run at `http://localhost:5173`.

## Usage

1. Open `http://localhost:5173` in your browser.
2. You will see the "Item Manager".
3. Add a new item using the form.
4. The item list below will update automatically.

## Notes
- The Django settings are configured for a local MongoDB instance. Update `backend/core/settings.py` if your DB credentials differ.
- CORS is enabled for `*` in development.
