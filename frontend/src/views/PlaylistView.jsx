import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAudio } from '../contexts/AudioContext'
import MusicPlayer from '../components/MusicPlayer'
import SongList from '../components/SongList'
import api from '../config/axios'

const PlaylistView = () => {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { 
    currentSong, 
    isPlaying, 
    playPlaylist, 
    currentTime,
    setCurrentSong,
    setIsPlaying
  } = useAudio()
  const [currentIndex, setCurrentIndex] = useState(null)

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true)
        setError(null) // Reset error state
        const response = await api.get(`/api/playlists/${playlistId}`)
        if (response.data) {
          setPlaylist(response.data)
        } else {
          setError('Playlist is empty')
        }
      } catch (err) {
        console.error('Error fetching playlist:', err)
        setError('Failed to load playlist. Please try again.')
        // Only navigate back on specific errors
        if (err.response?.status === 404) {
          setTimeout(() => navigate('/panel'), 2000) // Give user time to see error
        }
      } finally {
        setLoading(false)
      }
    }

    if (playlistId) {
      fetchPlaylist()
    }
  }, [playlistId, navigate])

  const handlePlay = (index) => {
    if (playlist?.songs?.length > 0) {
      try {
        playPlaylist(playlist.songs, index)
        // Let the user explicitly start playback through the MusicPlayer
      } catch (error) {
        console.error('Error setting up song:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading playlist...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/panel')}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Return to Playlists
          </button>
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>No playlist found</p>
          <button 
            onClick={() => navigate('/panel')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Return to Playlists
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <button 
          onClick={() => navigate('/panel')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Back to Playlists
        </button>
      </div>
      
      <MusicPlayer />
      
      {playlist.songs.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <SongList
            songs={playlist.songs}
            onPlay={handlePlay}
            currentSongId={currentSong?._id}
            isPlaying={isPlaying}
            currentTime={currentTime}
          />
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">This playlist is empty</p>
        </div>
      )}
    </div>
  )
}

export default PlaylistView 