# MoodMap

MoodMap is a minimal and responsive mood-tracking journal built with React, Tailwind CSS, and Firebase.

## Features

- Email/password authentication with Firebase Auth
- Protected routes with global auth state using Context API
- Daily mood entry with 5 sliders:
  - happiness
  - sadness
  - anxiety
  - anger
  - energy
- Optional free-form journal entry
- Calendar view showing entry vs no-entry days
- Analytics with Recharts:
  - average emotion values (week/month/year)
  - percentage distribution of emotions
- Filtering by time range and mood type
- Basic insights generated from mood trends
- Loading, empty, and error states

## Tech Stack

- React (functional components, hooks, lazy loading)
- React Router
- Tailwind CSS
- Firebase Auth + Firestore
- Recharts

## Project Structure

`src/`

- `components/`
- `pages/`
- `context/`
- `hooks/`
- `services/`

## Firebase Setup

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication > Email/Password**.
3. Create a **Firestore Database** in production or test mode.
4. Copy `.env.example` to `.env` and replace with your Firebase values.
5. Start the app.

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

## Local Development

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```
