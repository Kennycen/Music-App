import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import Navbar from '../components/Navbar'

const Playlist = () => {
    const [playlistName, setPlaylistName] = useState("")
    const [selectedSongs, setSelectedSongs] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredSongs, setFilteredSongs] = useState([])

    React.useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase()
        const filtered = []
        setFilteredSongs(filtered)
    }, [searchQuery])

    const handleSongToggle = (songId) => {
        setSelectedSongs((prev) => 
            prev.includes(songId) 
                ? prev.filter((id) => id !== songId) 
                : [...prev, songId]
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("New Playlist:", { name: playlistName, songs: selectedSongs })
        // Here you would typically send this data to your backend
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Create New Playlist</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="playlist-name" className="block text-sm font-medium text-gray-700">
                        Playlist Name
                    </label>
                    <input
                        id="playlist-name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="song-search" className="block text-sm font-medium text-gray-700">
                        Search Songs
                    </label>
                    <div className="mt-1 relative">
                        <input
                            id="song-search"
                            type="text"
                            placeholder="Search for songs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Select Songs</h2>
                    <ul className="space-y-2">
                        {filteredSongs.map((song) => (
                            <li key={song.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`song-${song.id}`}
                                    checked={selectedSongs.includes(song.id)}
                                    onChange={() => handleSongToggle(song.id)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`song-${song.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {song.title} - {song.artist}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <button 
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Create Playlist
                </button>
            </form>
        </div>
    )
}

export default Playlist