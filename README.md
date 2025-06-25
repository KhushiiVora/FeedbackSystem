# Feedback System

A full-stack feedback management system built with **React (frontend)** and **FastAPI (backend)**, with **MongoDB** as the database. Managers can log in, send feedback to employees, and view a dashboard interface with interactive UI components.

---

## 📦 Project Structure

The codebase is organized into two main folders:

- `frontend` – built using React
- `backend` – built using FastAPI

Each has its own setup and environment configuration.

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js & npm
- Python 3.10+
- MongoDB (running locally or cloud-hosted)
- Virtualenv (recommended for Python)

---

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file with the following content:

```env
VITE_BACKEND_URL=http://localhost:8000
```

Then, start the development server:

```bash
npm run dev
```

---

### Backend

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
# On Windows:
./venv/Scripts/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file based on the provided `.env.example` and fill in the required fields.

Run the development server using:

```bash
uvicorn app.main:app --reload
```

---

## 🛠️ Tech Stack & Design Decisions

- **Frontend**: React with modular folder structure under `src/`, including:

  - `components/`: Reusable UI elements
  - `styles/`: External CSS files
  - `utils/`: Utility functions
  - `api/`: API service calls

- **Backend**: FastAPI application structured with:

  - `routers/`: Endpoint definitions
  - `models/`: Pydantic schemas
  - `utils/`: Helper functions
  - Managed under the `app/` directory

- **Database**: MongoDB for storing user and feedback data

This separation of concerns helps maintain clarity, scalability, and ease of debugging across the project.

---

## 🤖 AI Assistance Transparency

Parts of the backend logic were written with the help of AI tools like ChatGPT. As a beginner in FastAPI, I used AI support to understand the framework better and implement the initial routes and logic efficiently. All AI-assisted code was carefully reviewed and adapted to meet the project’s requirements.

---

## 🌐 Public URL

<!-- > 🔗 [Live Demo](YOUR_PUBLIC_URL_HERE) -->

Coming Soon

---

## 📄 License

This project is for educational and demonstration purposes.
