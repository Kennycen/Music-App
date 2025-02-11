# Music App

A modern web application for uploading, managing, and playing music with playlist functionality. Built with React, Node.js, Express, MongoDB, and Cloudinary.

## Features

- 🎵 Upload and play MP3/WAV files
- 📱 Responsive design
- 📂 Create and manage playlists
- 🎶 Reorder songs in playlists
- 🔄 Auto-play next song
- ⏯️ Music player controls
- 📦 Cloud storage with Cloudinary

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Icons
- Cloudinary Upload Widget

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Multer
- Cloudinary

## Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- MongoDB account
- Cloudinary account

## Environment Variables

### Frontend (.env)

VITE_API_URL=http://localhost:4000
VITE_CLOUDINARY_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

### Backend (.env)

MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
CLOUDINARY_NAME=your_cloud_name
PORT=4000

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/music-app.git
cd music-app
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

## Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## Deployment

### Backend
1. Create a Vercel account
2. Install Vercel CLI: `npm i -g vercel`
3. Deploy: `vercel`

### Frontend
1. Build the project: `npm run build`
2. Deploy to Vercel: `vercel`

## Features in Detail

### Music Upload
- Supports MP3 and WAV formats
- Direct upload to Cloudinary
- Progress bar indication
- File size limit: 25MB

### Playlist Management
- Create multiple playlists
- Add/remove songs
- Reorder songs with drag-and-drop
- Auto-play functionality

### Music Player
- Play/pause control
- Next/previous track
- Progress bar
- Time display
- Volume control

## Acknowledgments

- Cloudinary for file storage
- MongoDB Atlas for database hosting
- Vercel for deployment