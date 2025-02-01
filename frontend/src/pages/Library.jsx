import React, { useState, useEffect } from 'react'
import { FaTrash, FaPlus } from 'react-icons/fa'
import Modal from '../components/Modal'
import SongList from '../components/SongList'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../contexts/AudioContext'

const ITEMS_PER_PAGE = 10

// Mock data for playlists (we'll implement real playlists later)
const mockPlaylists = [
  { id: 1, name: "My Favorites" },
  { id: 2, name: "Workout Mix" },
  { id: 3, name: "Chill Vibes" },
]

const Library = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [library, setLibrary] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [addingToPlaylist, setAddingToPlaylist] = useState(false)
  const navigate = useNavigate()
  const { playSong, currentSong, isPlaying, togglePlay, currentTime } = useAudio()

  // Fetch songs and playlists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsRes, playlistsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/songs`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/playlists`)
        ])
        setLibrary(songsRes.data)
        setPlaylists(playlistsRes.data)
        setError("")
      } catch (err) {
        console.error('Error fetching data:', err)
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredLibrary = library.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredLibrary.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentSongs = filteredLibrary.slice(startIndex, endIndex)

  const handlePlay = (index) => {
    const song = filteredLibrary[index]
    if (currentSong?._id === song._id) {
      togglePlay()
    } else {
      playSong(song)
    }
  }

  const handleOptionsClick = (song) => {
    setSelectedSong(song)
    setModalOpen(true)
  }

  const handleRemove = async (songId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/songs/${songId}`)
      setLibrary(prevLibrary => prevLibrary.filter(song => song._id !== songId))
      setModalOpen(false)
    } catch (err) {
      console.error('Error deleting song:', err)
      alert('Failed to delete song')
    }
  }

  const handleAddToPlaylist = async (playlistId) => {
    setAddingToPlaylist(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/playlists/${playlistId}/songs`, {
        songId: selectedSong._id
      })
      
      // Update playlists state with the updated playlist
      setPlaylists(prevPlaylists => 
        prevPlaylists.map(playlist => 
          playlist._id === playlistId ? response.data : playlist
        )
      )
      
      setModalOpen(false)
      alert('Song added to playlist successfully!')
    } catch (error) {
      console.error('Error adding song to playlist:', error)
      alert('Failed to add song to playlist')
    } finally {
      setAddingToPlaylist(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading songs...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">My Library</h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Upload Music
        </button>
      </div>

      <div className="mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search songs..."
        />
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : library.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No songs in your library yet.</p>
          <p className="mt-2">Upload some music to get started!</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <SongList
              songs={currentSongs}
              onPlay={handlePlay}
              onOptionsClick={handleOptionsClick}
              currentSongId={currentSong?._id}
              isPlaying={isPlaying}
              currentTime={currentTime}
            />
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
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
              <div className="border-b pb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Add to Playlist</h4>
                {playlists.length === 0 ? (
                  <p className="text-sm text-gray-500">No playlists available</p>
                ) : (
                  playlists.map((playlist) => (
                    <button
                      key={playlist._id}
                      onClick={() => handleAddToPlaylist(playlist._id)}
                      disabled={addingToPlaylist}
                      className="w-full flex items-center justify-between p-2 text-gray-700 hover:bg-gray-50 rounded-md disabled:opacity-50"
                    >
                      <span>{playlist.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {playlist.songs.length} songs
                        </span>
                        <FaPlus className="text-gray-400" />
                      </div>
                    </button>
                  ))
                )}
              </div>
              <button
                onClick={() => handleRemove(selectedSong._id)}
                className="w-full flex items-center justify-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <FaTrash />
                <span>Remove from Library</span>
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

export default Library