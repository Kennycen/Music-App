import express from 'express'
import multer from 'multer'
import path from 'path'
import Song from '../models/Song.js'

const router = express.Router()

// Configure local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') // Files will be stored in uploads directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log('Processing file:', file.originalname) // Add this for debugging
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true)
        } else {
            cb(new Error('Only audio files are allowed'))
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
}).single('audio')

// Wrap multer in custom error handling
router.post('/upload', (req, res) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'File upload error: ' + err.message })
        } else if (err) {
            return res.status(500).json({ error: 'Server error: ' + err.message })
        }
        
        // Continue with the rest of your upload logic
        handleUpload(req, res)
    })
})

async function handleUpload(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file uploaded' })
        }

        const { title, artist } = req.body
        if (!title) {
            return res.status(400).json({ error: 'Title is required' })
        }

        const newSong = new Song({
            title,
            artist: artist || 'Unknown Artist',
            audioUrl: `/uploads/${req.file.filename}`,
            cloudinaryId: 'local',
            duration: '0:00'
        })

        await newSong.save()
        res.status(201).json(newSong)
    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({ error: 'Failed to upload song' })
    }
}

// Get all songs
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 })
        res.json(songs)
    } catch (error) {
        console.error('Error fetching songs:', error)
        res.status(500).json({ error: 'Failed to fetch songs' })
    }
})

// Delete a song
router.delete('/:id', async (req, res) => {
    try {
        const song = await Song.findByIdAndDelete(req.params.id)
        if (!song) {
            return res.status(404).json({ error: 'Song not found' })
        }
        res.json({ message: 'Song deleted successfully' })
    } catch (error) {
        console.error('Error deleting song:', error)
        res.status(500).json({ error: 'Failed to delete song' })
    }
})

// Update song duration
router.patch('/:id', async (req, res) => {
    try {
        const { duration } = req.body
        const song = await Song.findByIdAndUpdate(
            req.params.id,
            { duration },
            { new: true }
        )
        if (!song) {
            return res.status(404).json({ error: 'Song not found' })
        }
        res.json(song)
    } catch (error) {
        console.error('Error updating song:', error)
        res.status(500).json({ error: 'Failed to update song' })
    }
})

export default router 