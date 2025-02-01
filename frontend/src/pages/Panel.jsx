import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBook, FaPlus, FaMusic } from 'react-icons/fa'
import axios from 'axios'
import CreatePlaylist from '../components/CreatePlaylist'

const Panel = () => {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/playlists`)
      setPlaylists(response.data)
      setError("")
    } catch (err) {
      console.error('Error fetching playlists:', err)
      setError("Failed to load playlists")
    } finally {
      setLoading(false)
    }
  }

  const handlePlaylistCreated = (newPlaylist) => {
    setPlaylists(prev => [...prev, newPlaylist])
  }

  const handlePlaylistClick = async (playlistId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/playlists/${playlistId}`)
      const playlist = response.data
      if (playlist.songs.length > 0) {
        navigate(`/playlist/${playlistId}`)
      }
    } catch (error) {
      console.error('Error loading playlist:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading playlists...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">My Playlists</h1>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Link to="/library" className="w-full sm:w-auto">
            <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <FaBook className="inline mr-2" /> My Library
            </button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              <FaPlus className="inline mr-2" /> Upload Music
            </button>
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Playlist</h2>
        <CreatePlaylist onPlaylistCreated={handlePlaylistCreated} />
      </div>

      <div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {playlists.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaMusic className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No playlists yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <div key={playlist._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-xl mb-2">{playlist.name}</h3>
                <p className="text-gray-500 mb-4">
                  {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                </p>
                <button
                  onClick={() => handlePlaylistClick(playlist._id)}
                  className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium"
                >
                  <span>View Playlist</span>
                  <FaPlus className="ml-2" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Panel