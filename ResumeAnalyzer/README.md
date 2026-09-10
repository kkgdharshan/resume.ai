# ResumAI - AI Resume Analyzer

Built as an AI-powered resume analysis and career assistance platform.

## Overview
ResumAI is a full-stack web application that allows users to upload their resumes (PDF/DOCX) and receive immediate, AI-driven feedback. It uses OpenAI to analyze resume content, score ATS compatibility, detect missing skills, compare against job descriptions, and provides an interactive AI Chatbot to help rewrite and improve the resume.

## Features
- **Upload & Parse:** Drag and drop PDF or DOCX resumes.
- **AI Analysis:** Get an overall score, ATS score, strengths, weaknesses, and improvement suggestions.
- **Skill Detection:** Automatically extracts detected skills and recommends missing ones.
- **Job Matching:** Paste a job description to get a match score and keyword analysis.
- **AI Chatbot:** A dedicated assistant aware of the uploaded resume's context to help rewrite sections or answer career questions.

## Technology Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide React, React-Circular-Progressbar
- **Backend:** Python, Flask, SQLite, OpenAI API, PyPDF2, python-docx
- **Security:** Environment variables for API keys (never exposed to frontend)

## Project Architecture
```
resume-analyzer/
│
├── frontend/             # React application (Vite)
│   ├── src/
│   │   ├── pages/        # React route components
│   │   ├── services/     # API communication (Axios)
│   │   └── index.css     # Tailwind CSS
│   └── package.json
│
├── backend/              # Flask application
│   ├── app.py            # Main API routes
│   ├── database/         # SQLite initialization and queries
│   ├── utils/            # Parser and OpenAI helper functions
│   ├── uploads/          # Temporary storage for uploaded resumes
│   └── requirements.txt
│
└── .env                  # Environment variables (OpenAI API Key)
```

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (3.8+)
- An OpenAI API Key

### 1. Environment Variable Setup
Create a `.env` file in the root `backend` directory (or wherever you run the Flask app):
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## How it Works
1. **Upload:** React frontend sends the file via `multipart/form-data` to Flask.
2. **Extraction:** Flask uses `PyPDF2` or `python-docx` to extract raw text.
3. **Analysis:** The raw text is sent to OpenAI with a strict prompt expecting a JSON response detailing scores, skills, and feedback.
4. **Storage:** The raw text and JSON analysis are saved in a local SQLite database (`resume_analyzer.db`).
5. **Chat:** The AI assistant uses the saved raw text as context in its system prompt to provide highly specific advice.
