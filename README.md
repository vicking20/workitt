# Workitt - AI-Powered Career Advancement Platform

Workitt is a modern, brutalist-style web application designed to help users advance their careers using AI. It provides tools to generate and manage resumes, cover letters, and track job applications, all enhanced by AI capabilities.

## 🚀 Features

-   **AI Resume Builder**: Create professional resumes with AI-generated content tailored to your industry.
-   **Smart Cover Letters**: Generate personalized cover letters matching your resume and specific job descriptions.
-   **Dashboard**: Track your application metrics and manage your career documents.
-   **Brutalist Design**: A unique, high-contrast, responsive user interface focused on clarity and impact.
-   **Secure Authentication**: Robust user management with email verification and password reset flows.

## 🛠️ Technology Stack

### Frontend
-   **Framework**: React 18 (Vite)
-   **Styling**: Tailwind CSS (with custom brutalist, geo-pattern theme)
-   **Routing**: React Router v6
-   **State Management**: React Context API
-   **Icons**: Material Symbols Outlined

### Backend
-   **Framework**: Flask (Python)
-   **Database**: SQLite
-   **ORM**: SQLAlchemy
-   **Auth**: Flask-Login, bcrypt
-   **AI Integration**: OpenAI / Gemini / DeepSeek (Configurable) / more coming soon

## 📦 Installation & Setup

### Prerequisites
-   Node.js (v18+)
-   Python (v3.9+)
-   npm

### 1. Clone the Repository
```bash
git clone https://github.com/vicking20/workitt.git
cd workitt
```
### 2. Frontend Setup
Navigate to the frontend directory.

```bash
cd ../workitt-frontend

# Install dependencies
npm install
```

### 3. Backend Setup
Navigate to the backend directory and set up the Python environment.

```bash
cd workitt-backend
python3 install.py
Follow the menu to configure your setup, and finally, start_workitt, it will start frontend abc backend server and you should be able to access frontend from localhost:3000 in dev mode.
```
The backend API will run on `http://localhost:5000`.

## 🔧 Configuration

### Environment Variables
-   **Frontend**: Create `.env` if needed for custom API URLs (`VITE_API_URL`). Defaults to proxying to localhost:5000.
-   **Backend**: Configuration is stored securely in `workitt-backend/data/config.json`. Use `install.py` or modify the file manually (encrypted values require the master key).

### Tailwind Theme
The project uses a custom Tailwind configuration (`tailwind.config.js`) defining specific brand colors like `brand-accent` (Terracotta), `brand-gold`, and `primary` (Deep Space Blue).

## 🤝 Usage

1.  **Register/Login**: Create an account on the Signup page.
2.  **Dashboard**: Overview of your career assets.
3.  **Resumes**: Create a new resume. specific sections can be auto-filled by AI prompts.
4.  **Cover Letters**: Input job details to generate a tailored letter.
5.  **Print/Export**: Purely formatted documents as PDF.

## 📄 License

This project is licensed under the MIT License.
