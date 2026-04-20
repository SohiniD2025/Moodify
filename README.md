# MoodMap

A minimal and user-friendly mood tracking journal built for daily emotional logging and reflection.

## Problem Statement

Many people want to track their emotional health, but existing tools are often too complex or inconsistent for daily use.  
`MoodMap` solves this by offering a calm, lightweight journaling experience where users can:

- log multiple mood dimensions (not just one score),
- attach optional written reflections,
- observe trends over time using charts and calendar views,
- and gain simple insights from their own data.

## Features

- Email/password authentication with Firebase Auth
- Protected routes with global auth state using Context API
- Daily mood entry with 5 sliders (`happiness`, `sadness`, `anxiety`, `anger`, `energy`)
- Optional journal entry with each mood log
- Calendar visualization of days with/without entries
- Analytics dashboard with:
  - average mood values for week/month/year
  - emotion distribution percentages
- Filtering by date range and mood type
- Basic computed insights (trend-based, non-AI)
- Entry deletion support
- Dark mode / light mode toggle
- Responsive UI with loading, empty, and error states

## Tech Stack

- **Frontend:** React (functional components), React Router
- **Styling:** Tailwind CSS
- **Backend Services:** Firebase Authentication (Email/Password), Firestore
- **Visualization:** Recharts
- **Utilities:** date-fns

## Setup Instructions

### 1) Clone and install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file (or copy from `.env.example`) and add:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3) Configure Firebase project

In [Firebase Console](https://console.firebase.google.com/):

1. Create/select a Firebase project
2. Enable **Authentication > Email/Password**
3. Enable **Firestore Database**
4. Add your Web App and copy config values into `.env`

### 4) Run locally

```bash
npm run dev
```

### 5) Build for production

```bash
npm run build
npm run preview
```

## Project Structure

`src/`

- `components/`
- `pages/`
- `context/`
- `hooks/`
- `services/`

## Firestore Schema

Collection: `moodEntries`

Each document stores:

- `userId` (string)
- `date` (YYYY-MM-DD string)
- `happiness` (number)
- `sadness` (number)
- `anxiety` (number)
- `anger` (number)
- `energy` (number)
- `journalText` (string)
- `createdAt` (ISO string)
