import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBook, FaPlus, FaMusic, FaEllipsisV } from 'react-icons/fa'
import axios from 'axios'
import CreatePlaylist from '../components/CreatePlaylist'

const Panel = () => {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
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
      setLoading(true) // Add loading state
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/playlists/${playlistId}`)
      if (response.data) {
        navigate(`/playlist/${playlistId}`)
      }
    } catch (error) {
      console.error('Error accessing playlist:', error)
      // Show error message to user
      setError('Unable to open playlist. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (e, playlist) => {
    e.stopPropagation() // Prevent playlist click
    setSelectedPlaylist(playlist)
    setNewPlaylistName(playlist.name)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPlaylist(null)
    setNewPlaylistName('')
  }

  const handleDeletePlaylist = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/playlists/${selectedPlaylist._id}`)
      setPlaylists(playlists.filter(p => p._id !== selectedPlaylist._id))
      handleCloseModal()
    } catch (error) {
      console.error('Error deleting playlist:', error)
    }
  }

  const handleUpdatePlaylistName = async () => {
    if (!newPlaylistName.trim()) return
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/playlists/${selectedPlaylist._id}`, {
        name: newPlaylistName
      })
      setPlaylists(playlists.map(p => 
        p._id === selectedPlaylist._id ? response.data : p
      ))
      handleCloseModal()
    } catch (error) {
      console.error('Error updating playlist name:', error)
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
              <div 
                key={playlist._id} 
                className="bg-white p-4 rounded-lg shadow-md relative flex justify-between items-center"
              >
                <Link 
                  to={`/playlist/${playlist._id}`}
                  className="flex-1 cursor-pointer"
                  onClick={(e) => e.stopPropagation()} // Ensure clean click handling
                >
                  <h3 className="text-xl font-semibold text-gray-900">{playlist.name}</h3>
                  <p className="text-gray-600">{playlist.songs.length} songs</p>
                </Link>
                <button 
                  onClick={(e) => handleOpenModal(e, playlist)}
                  className="p-2 hover:bg-gray-100 rounded-full ml-2"
                >
                  <FaEllipsisV className="text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedPlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Playlist Options</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Playlist Name
              </label>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleUpdatePlaylistName}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Name
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Playlist
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Panel