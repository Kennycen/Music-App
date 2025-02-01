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

const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://music-app-frontend-eight-beta.vercel.app']
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}

app.use(cors(corsOptions))

// Routes
app.use('/api/songs', songsRouter)
app.use('/api/playlists', playlistsRouter)

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

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