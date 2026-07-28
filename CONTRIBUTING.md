# Contributing to MailPilot AI

Thank you for considering contributing to **MailPilot AI**! 

## Code of Conduct
Please review and follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all community interactions.

## Development Setup

### Backend (FastAPI + Python 3.13)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (React 19 + TypeScript + Vite)
```bash
cd frontend
npm install
npm run dev
```

### Running Tests
```bash
# Backend pytest suite
cd backend
pytest

# Frontend build check
cd frontend
npm run build
```

## Pull Request Guidelines
1. Fork the repo and create a feature branch (`git checkout -b feature/my-new-feature`).
2. Ensure all tests pass.
3. Submit a pull request following the PR template.
