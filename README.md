# Admin Live-Chat Dashboard

A fully functional Admin Live-Chat Dashboard built with React, TypeScript, Vite, and Firebase Firestore. This dashboard allows admins to manage real-time chat conversations with users from chatbots or website widgets.

## Features

- 🔄 **Real-time messaging** with Firebase Firestore
- 💬 **Live chat management** - view, respond, and manage multiple conversations
- 📊 **Dashboard analytics** - view chat statistics and status
- 🔍 **Search and filtering** - find conversations quickly
- 👥 **Session management** - activate, close, or reopen conversations
- ⚡ **Typing indicators** - see when users are typing
- 📱 **Responsive design** - works on desktop and mobile
- 🎨 **Modern UI** - built with Tailwind CSS and Lucide icons

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4.0
- **Database**: Firebase Firestore (real-time)
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/           # React components
│   ├── Dashboard.tsx     # Main dashboard layout
│   ├── Header.tsx        # Header with stats and filters
│   ├── ChatSessionsList.tsx  # Chat sessions sidebar
│   ├── ChatWindow.tsx    # Individual chat view
│   └── index.ts          # Component exports
├── hooks/               # Custom React hooks
│   ├── useChatSessions.ts    # Session management hook
│   ├── useMessages.ts        # Messages hook
│   ├── useTypingIndicators.ts # Typing indicators hook
│   └── index.ts              # Hook exports
├── services/            # Service layer
│   ├── firebase.ts      # Firebase configuration
│   ├── chatService.ts   # Firestore operations
│   ├── demoDataService.ts # Demo data (development)
│   └── index.ts         # Service exports
├── types/               # TypeScript type definitions
│   ├── chat.ts          # Chat-related types
│   └── index.ts         # Type exports
├── utils/               # Utility functions
│   └── helpers.ts       # Helper functions
└── App.tsx              # Main App component
```

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics (optional)

### 2. Set Up Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development) or "Start in production mode"
4. Select a location for your database

### 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. In the "General" tab, scroll to "Your apps"
3. Click "Add app" → "Web" (</>) 
4. Register your app with a nickname
5. Copy the Firebase config object

### 4. Configure Firebase in Your App

Update `src/services/firebase.ts` with your Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain", 
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Data Structure

### ChatSession Document

```typescript
{
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string; 
  lastActivity: Date;
  unreadCount: number;
  status: 'active' | 'waiting' | 'closed';
  metadata?: {
    userAgent?: string;
    referrer?: string;
    location?: string;
  };
}
```

### Message Document

```typescript
{
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'admin' | 'bot';
  sessionId: string;
  isRead?: boolean;
  adminId?: string; // for admin messages
}
```

## Integration with Chat Widgets

To integrate this admin dashboard with your website's chat widget or Dialogflow:

### 1. Website Chat Widget

Create messages in Firestore from your chat widget:

```javascript
// Client-side chat widget code
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const sendUserMessage = async (sessionId, message) => {
  await addDoc(collection(db, 'messages'), {
    sessionId,
    text: message,
    sender: 'user',
    timestamp: serverTimestamp(),
    isRead: false
  });
};
```

**Important**: Before running the app, you must configure Firebase in `src/services/firebase.ts` with your actual Firebase project credentials.

## License

This project is open source. You can use it for personal and commercial projects.