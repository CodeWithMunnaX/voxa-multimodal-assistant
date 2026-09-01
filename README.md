# Voxa AI

Voxa AI is a comprehensive multimodal AI assistant and intelligent tutoring platform. It seamlessly integrates chat, voice interactions, document analysis, and presentation generation to provide a rich, interactive learning and productivity experience.

## 🚀 Features

- **Conversational AI & Tutor:** Context-aware intelligent chat for answering questions and guided learning.
- **Voice Sessions:** Real-time voice interactions for hands-free assistance.
- **Document Intelligence:** Upload, parse, and analyze PDFs and other documents to extract text and generate insights.
- **Notes & Presentations:** Automatically generate structured notes and presentation materials from your sessions.
- **Analytics & Tracking:** Monitor your usage, study habits, and learning progress.
- **Cloud Media Storage:** Integration with Cloudinary for seamless document and media management.

## 💻 Tech Stack

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling:** Tailwind CSS & [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Data Visualization:** Recharts
- **PDF Parsing:** pdf-parse & pdf2json

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Architecture:** MVC (Controllers, Models, Services)
- **Database:** SQLAlchemy & Alembic (SQLite by default, easily extensible to PostgreSQL)
- **AI Integration:** Google Gemini & Generative AI SDKs
- **File Storage:** Cloudinary
- **Rate Limiting:** SlowAPI

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- API Keys for Google Gemini and Cloudinary

### 1. Backend Setup
```bash
cd Backend-
# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your Gemini API key, Cloudinary credentials, etc.

# Run database migrations
alembic upgrade head

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`. You can view the API documentation at `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend will be available at `http://localhost:3000`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the MIT License.
