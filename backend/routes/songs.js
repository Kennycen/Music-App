import express from 'express'
import multer from 'multer'
import Song from '../models/Song.js'
import connectCloudinary from '../config/cloudinary.js'

const router = express.Router()
const storage = connectCloudinary()
const upload = multer({ storage: storage })

// Upload a new song
router.post('/upload', upload.single('audio'), async (req, res) => {
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
            audioUrl: req.file.path,
            cloudinaryId: req.file.filename,
            duration: '0:00' // Duration will be updated when first played
        })

        await newSong.save()
        res.status(201).json(newSong)
    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({ error: 'Failed to upload song' })
    }
})

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