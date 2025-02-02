import React, { useState } from 'react'
import api from '../config/axios'

const CreatePlaylist = ({ onPlaylistCreated }) => {
  const [name, setName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsCreating(true)
    try {
      const response = await api.post('/api/playlists', {
        name: name.trim()
      })
      onPlaylistCreated(response.data)
      setName('')
    } catch (error) {
      console.error('Error creating playlist:', error)
      alert('Failed to create playlist')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New playlist name"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={isCreating || !name.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {isCreating ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}

export default CreatePlaylist 