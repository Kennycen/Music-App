import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import multer from 'multer'
import songsRouter from './routes/songs.js'
import playlistsRouter from './routes/playlists.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
const isDevelopment = process.env.NODE_ENV === 'development'

// Connect to MongoDB
try {
    await connectDB()
    console.log('MongoDB connected successfully')
} catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
}

// Configure Cloudinary storage
const storage = connectCloudinary()
const upload = multer({ storage: storage })

// middlewares
app.use(express.json())

// CORS configuration
const corsOptions = {
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: false,  // Set to false since we're using '*' for origin
    allowedHeaders: ['Content-Type', 'Authorization']
}

// Use CORS with options
app.use(cors(corsOptions))

// Make sure preflight requests work
app.options('*', cors(corsOptions))

// Add this near the top of your file
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/songs', songsRouter)
app.use('/api/playlists', (req, res, next) => {
    console.log('Playlist request received:', {
        method: req.method,
        url: req.url,
        body: req.body,
        query: req.query
    });
    next();
}, playlistsRouter)

// Update error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal server error',
            status: err.status || 500
        }
    });
});

// Add this catch-all route at the end
app.use('*', (req, res) => {
    console.log('404 - Route not found:', req.originalUrl);
    res.status(404).json({
        error: {
            message: `Route ${req.originalUrl} not found`,
            status: 404
        }
    });
});

// api endpoints
app.get('/', (req, res)=> {
    res.send('API Working')
})

// Upload endpoint example
app.post('/upload', upload.single('audio'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' })
        }
        res.json({ 
            message: 'File uploaded successfully',
            file: req.file 
        })
    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({ error: 'Upload failed' })
    }
})

const server = app.listen(port, () => console.log('Server started on PORT: ' + port))

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err)
    server.close(() => process.exit(1))
})