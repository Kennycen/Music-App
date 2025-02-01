import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import SongList from '../components/SongList'
import { useAudio } from '../contexts/AudioContext'
import { FaArrowLeft } from 'react-icons/fa'
import MusicPlayer from '../components/MusicPlayer'
import Modal from '../components/Modal'

const PlaylistView = () => {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { playPlaylist, currentSong, isPlaying, currentIndex, currentTime, togglePlay } = useAudio()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState(null)

  useEffect(() => {
    fetchPlaylist()
  }, [playlistId])

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/playlists/${playlistId}`)
      setPlaylist(response.data)
      setError("")
    } catch (err) {
      console.error('Error fetching playlist:', err)
      setError("Failed to load playlist")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSong = async (songId) => {
    try {
      await axios.delete(`http://localhost:4000/api/playlists/${playlistId}/songs/${songId}`)
      fetchPlaylist() // Refresh playlist after removing song
      setModalOpen(false)
    } catch (err) {
      console.error('Error removing song:', err)
      alert('Failed to remove song from playlist')
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
      handlePlay(0) // Start with the first (newest) song
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
              <p className="text-gray-500 mb-4">No songs in this playlist yet.</p>
              <button
                onClick={() => navigate('/library')}
                className="text-blue-500 hover:text-blue-600"
              >
                Add songs from your library
              </button>
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