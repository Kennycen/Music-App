import express from 'express'
import Playlist from '../models/Playlist.js'
import Song from '../models/Song.js'

const router = express.Router()

// Get all playlists
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find().populate('songs')
        res.json(playlists)
    } catch (error) {
        console.error('Error fetching playlists:', error)
        res.status(500).json({ error: 'Failed to fetch playlists' })
    }
})

// Create new playlist
router.post('/', async (req, res) => {
    try {
        const { name } = req.body
        const newPlaylist = new Playlist({ name, songs: [] })
        await newPlaylist.save()
        res.status(201).json(newPlaylist)
    } catch (error) {
        console.error('Error creating playlist:', error)
        res.status(500).json({ error: 'Failed to create playlist' })
    }
})

// Add song to playlist
router.post('/:playlistId/songs', async (req, res) => {
    try {
        const { playlistId } = req.params
        const { songId } = req.body

        const playlist = await Playlist.findById(playlistId)
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' })
        }

        if (!playlist.songs.includes(songId)) {
            playlist.songs.unshift(songId)
            await playlist.save()
        }

        const updatedPlaylist = await Playlist.findById(playlistId)
            .populate({
                path: 'songs',
                options: { sort: { 'createdAt': -1 } }
            })
        res.json(updatedPlaylist)
    } catch (error) {
        console.error('Error adding song to playlist:', error)
        res.status(500).json({ error: 'Failed to add song to playlist' })
    }
})

// Remove song from playlist
router.delete('/:playlistId/songs/:songId', async (req, res) => {
    try {
        const { playlistId, songId } = req.params

        const playlist = await Playlist.findById(playlistId)
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' })
        }

        playlist.songs = playlist.songs.filter(id => id.toString() !== songId)
        await playlist.save()

        const updatedPlaylist = await Playlist.findById(playlistId).populate('songs')
        res.json(updatedPlaylist)
    } catch (error) {
        console.error('Error removing song from playlist:', error)
        res.status(500).json({ error: 'Failed to remove song from playlist' })
    }
})

// Get single playlist
router.get('/:playlistId', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId)
            .populate({
                path: 'songs',
                options: { sort: { 'createdAt': -1 } }
            })
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' })
        }
        res.json(playlist)
    } catch (error) {
        console.error('Error fetching playlist:', error)
        res.status(500).json({ error: 'Failed to fetch playlist' })
    }
})

// Update playlist name
router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body
        const playlist = await Playlist.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        )
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' })
        }
        res.json(playlist)
    } catch (error) {
        console.error('Error updating playlist:', error)
        res.status(500).json({ message: 'Error updating playlist' })
    }
})

// Delete playlist
router.delete('/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findByIdAndDelete(req.params.id)
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' })
        }
        res.json({ message: 'Playlist deleted successfully' })
    } catch (error) {
        console.error('Error deleting playlist:', error)
        res.status(500).json({ message: 'Error deleting playlist' })
    }
})

// Add this route to handle reordering
router.put('/:id/reorder', async (req, res) => {
  try {
    const { songIds } = req.body
    
    if (!songIds || !Array.isArray(songIds)) {
      return res.status(400).json({ error: 'Invalid song order provided' })
    }

    const playlist = await Playlist.findById(req.params.id)
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' })
    }

    // Update the songs array with the new order
    playlist.songs = songIds
    await playlist.save()

    // Return the updated playlist
    const updatedPlaylist = await Playlist.findById(req.params.id)
      .populate('songs')
      .exec()

    res.json(updatedPlaylist)
  } catch (error) {
    console.error('Error reordering playlist:', error)
    res.status(500).json({ error: 'Failed to reorder playlist' })
  }
})

export default router 