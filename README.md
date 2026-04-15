# TubeStamp

Transform YouTube videos into clean timestamps, quick summaries, and better publishing workflows.

## Overview

TubeStamp is a web application that helps content creators and video enthusiasts generate structured timestamps from YouTube videos using AI-powered video analysis. It integrates with the BumpUps API to extract and format video content insights.

## Features

- 🎥 **YouTube Video Processing** - Paste a YouTube URL to extract video metadata
- ⏱️ **Timestamp Generation** - Automatically generate structured timestamps using AI
- 💾 **Local History** - Save and revisit recently processed videos
- 🚀 **Firebase Powered** - Serverless backend with Cloud Functions
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: React 19 + Vite
- **Backend**: Firebase Cloud Functions (Python 3.13)
- **Styling**: CSS3 with CSS variables
- **APIs**: Firebase, YouTube Data API, BumpUps API
- **Deployment**: Firebase Hosting + Cloud Functions

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16+) and npm
- **Python** (v3.13+) for Firebase Functions development
- **Firebase CLI** installed globally: `npm install -g firebase-tools`
- **Firebase Project** already set up in Firebase Console
- **API Keys**:
  - YouTube Data API key
  - BumpUps API key

## Setup Instructions

### 1. Clone Repository & Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd tubestampprod

# Install frontend dependencies
npm install

# Set up Python virtual environment for Cloud Functions
cd functions
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Go back to root
cd ..
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API keys:
# - VITE_API_KEY (Firebase API Key)
# - VITE_AUTH_DOMAIN (Firebase Auth Domain)
# - VITE_PROJECT_ID (Firebase Project ID)
# - VITE_STORAGE_BUCKET (Firebase Storage Bucket)
# - VITE_MESSAGING_SENDER_ID (Firebase Messaging Sender ID)
# - VITE_APP_ID (Firebase App ID)
# - VITE_MEASUREMENT_ID (Firebase Measurement ID)
# - VITE_YOUTUBE_API_KEY (YouTube Data API Key)
```

### 3. Firebase Configuration

```bash
# Log in to Firebase
firebase login

# Initialize/connect Firebase to your project
firebase use --add

# Select your Firebase project from the list
```

### 4. Set Firebase Cloud Functions Environment Variables

```bash
# For Cloud Functions to access BumpUps API
firebase functions:config:set bumpups.api_key="your_bumpups_api_key_here"
```

## Development

### Start Development Server

```bash
# Terminal 1: Start the Vite dev server
npm run dev

# The app will be available at http://localhost:5173

# Terminal 2 (optional): Start Firebase Functions emulator
firebase emulators:start --only functions
```

### Build for Production

```bash
# Build the React app
npm run build

# This creates a `dist/` folder ready for deployment
```

### Linting

```bash
# Check code quality
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## Deployment

### Deploy to Firebase

```bash
# Deploy everything (hosting + functions)
firebase deploy

# Or deploy specific services:
firebase deploy --only hosting
firebase deploy --only functions
```

### Preview Locally Before Deployment

```bash
# Build the app
npm run build

# Preview the production build locally
npm run preview
```

## Project Structure

```
tubestampprod/
├── src/
│   ├── components/          # React components
│   │   └── unAuth/
│   │       └── components/
│   │           ├── LandingPage.jsx
│   │           ├── NavBar.jsx
│   │           ├── Timestamp.jsx
│   │           ├── LocalHistory.jsx
│   │           ├── BumpUps.jsx
│   │           └── Footer.jsx
│   ├── App.jsx              # Main app component
│   ├── firebase.js          # Firebase initialization
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── functions/
│   ├── main.py              # Cloud Functions (Python)
│   └── requirements.txt      # Python dependencies
├── firebase.json            # Firebase configuration
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint configuration
├── package.json             # Frontend dependencies
└── README.md                # This file
```

## API Integration

### YouTube Data API

The app uses the YouTube Data API v3 to fetch video metadata (title, thumbnail, duration).

- Get your API key: https://console.developers.google.com/
- Enable YouTube Data API v3 in your project

### BumpUps API

The app uses BumpUps API to generate timestamps from video URLs.

- Sign up: https://bumpups.com
- Get API key from your BumpUps dashboard
- Set the API key in Firebase Functions environment variables

## Troubleshooting

### "Missing ENV variable" Error

- Ensure `.env` file exists in the root directory
- Verify all required variables are set
- Restart the development server after updating `.env`

### Firebase Functions Not Connecting

```bash
# Restart emulators
firebase emulators:start --only functions

# Check logs
firebase functions:log
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf dist/ node_modules/
npm install
npm run build
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Check existing GitHub Issues
- Create a new Issue with detailed description
- Include error messages and steps to reproduce

## Roadmap

- [ ] User authentication with Firebase Auth
- [ ] Firestore database for persistent history
- [ ] Advanced video analysis features
- [ ] Export timestamps in multiple formats (SRT, JSON, CSV)
- [ ] Batch processing for multiple videos
- [ ] Video preview player with timestamp navigation
