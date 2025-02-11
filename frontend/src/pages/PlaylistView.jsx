import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import SongList from '../components/SongList'
import { useAudio } from '../contexts/AudioContext'
import { FaArrowLeft, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import MusicPlayer from '../components/MusicPlayer'
import Modal from '../components/Modal'
import api from '../config/axios'  // Import the configured axios instance

const PlaylistView = () => {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { 
    playPlaylist, 
    currentSong, 
    isPlaying, 
    currentIndex, 
    currentTime, 
    togglePlay
  } = useAudio()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState(null)

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/api/playlists/${playlistId}`)
        setPlaylist(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching playlist:', err)
        setError('Failed to load playlist')
      } finally {
        setLoading(false)
      }
    }

    if (playlistId) {
      fetchPlaylist()
    }
  }, [playlistId])

  const handleRemoveSong = async (songId) => {
    try {
      await api.delete(`/api/playlists/${playlistId}/songs/${songId}`)
      fetchPlaylist() // Refresh playlist after removing song
      setModalOpen(false)
    } catch (err) {
      console.error('Error removing song:', err)
      alert('Failed to remove song from playlist')
    }
  }

  const handleMoveSong = async (songId, direction) => {
    try {
      const currentIndex = playlist.songs.findIndex(song => song._id === songId)
      if (
        (direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === playlist.songs.length - 1)
      ) {
        return // Can't move further up/down
      }

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      const newSongs = [...playlist.songs]
      const [movedSong] = newSongs.splice(currentIndex, 1)
      newSongs.splice(newIndex, 0, movedSong)

      // Update playlist order in backend
      await api.put(`/api/playlists/${playlistId}/reorder`, {
        songIds: newSongs.map(song => song._id)
      })

      // Update local state
      setPlaylist({
        ...playlist,
        songs: newSongs
      })
      setModalOpen(false)
    } catch (err) {
      console.error('Error reordering songs:', err)
      alert('Failed to reorder songs')
    }
  }

  const handleOptionsClick = (song) => {
    setSelectedSong(song)
    setModalOpen(true)
  }

  const handleBack = () => {
    navigate('/panel')
  }

  const handlePlay = (startIndex = 0) => {
    if (playlist && playlist.songs.length > 0) {
      if (currentSong?._id === playlist.songs[startIndex]._id) {
        togglePlay()
      } else {
        playPlaylist(playlist.songs, startIndex)
      }
    }
  }

  // Play newest song when coming from panel
  useEffect(() => {
    if (playlist && playlist.songs.length > 0 && !currentSong) {
      handlePlay(0)
    }
  }, [playlist])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading playlist...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleBack}
        className="flex items-center text-blue-500 hover:text-blue-600 mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to Playlists
      </button>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : playlist ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
            <p className="text-gray-600">{playlist.songs.length} songs</p>
          </div>

          <div className="mb-8">
            <MusicPlayer />
          </div>

          {playlist.songs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No songs in this playlist.</p>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <SongList
                songs={playlist.songs}
                onPlay={handlePlay}
                onOptionsClick={handleOptionsClick}
                currentSongId={currentSong?._id}
                isPlaying={isPlaying}
                currentIndex={currentIndex}
                currentTime={currentTime}
                readOnly={true}
              />
            </div>
          )}

          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Song Options"
          >
            {selectedSong && (
              <>
                <p className="text-gray-600 mb-4">{selectedSong.title}</p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleMoveSong(selectedSong._id, 'up')}
                    disabled={playlist.songs.indexOf(selectedSong) === 0}
                    className="w-full flex items-center justify-center space-x-2 p-2 text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaArrowUp className="mr-2" />
                    <span>Move Up</span>
                  </button>
                  <button
                    onClick={() => handleMoveSong(selectedSong._id, 'down')}
                    disabled={playlist.songs.indexOf(selectedSong) === playlist.songs.length - 1}
                    className="w-full flex items-center justify-center space-x-2 p-2 text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaArrowDown className="mr-2" />
                    <span>Move Down</span>
                  </button>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={() => handleRemoveSong(selectedSong._id)}
                    className="w-full flex items-center justify-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <span>Remove from Playlist</span>
                  </button>
                </div>
              </>
            )}
          </Modal>
        </>
      ) : (
        <p className="text-center">Playlist not found</p>
      )}
    </div>
  )
}

export default PlaylistView 