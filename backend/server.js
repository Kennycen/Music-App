import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import songsRouter from './routes/songs.js'
import playlistsRouter from './routes/playlists.js'

// App Config
const app = express()
const port = process.env.PORT || 4000

// Connect to MongoDB
try {
    await connectDB()
    console.log('MongoDB connected successfully')
} catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
}

// middlewares
app.use(express.json())
app.use(cors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

// Increase the server timeout
app.use((req, res, next) => {
    res.setTimeout(300000); // 5 minutes
    next();
});

// Routes
app.use('/api/songs', songsRouter)
app.use('/api/playlists', playlistsRouter)

// api endpoints
app.get('/api', (req, res) => {
    res.json({ message: 'API Working' })
})

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        error: {
            message: `Route ${req.originalUrl} not found`,
            status: 404
        }
    })
})

// For all other routes, send the status
app.use('*', (req, res) => {
    res.status(200).json({ status: 'Server is running' })
})

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack
    })
    res.status(500).json({ 
        error: err.message || 'Something went wrong!' 
    })
})

// Set server timeout
const server = app.listen(port, () => {
    server.timeout = 300000; // 5 minutes
    console.log('Server started on PORT: ' + port)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err)
    server.close(() => process.exit(1))
})