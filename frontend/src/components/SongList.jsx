import React from 'react'
import { FaPlay, FaPause, FaClock, FaEllipsisV } from 'react-icons/fa'
import { useAudio } from '../contexts/AudioContext'
import { formatTime } from '../utils/formatTime'

const SongList = ({ 
  songs, 
  onPlay, 
  onOptionsClick,
  currentSongId,
  isPlaying,
  currentIndex,
  currentTime
}) => {
  const handlePlayClick = (index) => {
    if (!songs[index].audioUrl) {
      console.error('No audio URL available for this song')
      return
    }
    onPlay(index)
  }

  return (
    <ul className="divide-y divide-gray-200">
      {songs.map((song, index) => {
        const isCurrentSong = currentSongId === song._id
        return (
          <li 
            key={song._id} 
            className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
            onClick={() => handlePlayClick(index)}
          >
            <div>
              <div className="font-semibold">{song.title}</div>
              {song.artist && <div className="text-sm text-gray-500">{song.artist}</div>}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-500">
                <FaClock className="w-4 h-4 mr-1" />
                <span>
                  {isCurrentSong && isPlaying 
                    ? formatTime(currentTime)
                    : song.duration}
                </span>
              </div>
              <button 
                className="p-2 text-gray-600 hover:text-gray-800"
                onClick={(e) => {
                  e.stopPropagation() // Prevent triggering the li onClick
                  handlePlayClick(index)
                }}
              >
                {isCurrentSong && isPlaying ? (
                  <FaPause className="w-4 h-4" />
                ) : (
                  <FaPlay className="w-4 h-4" />
                )}
              </button>
              <button 
                className="p-2 text-gray-600 hover:text-gray-800"
                onClick={(e) => {
                  e.stopPropagation() // Prevent triggering the li onClick
                  onOptionsClick(song)
                }}
              >
                <FaEllipsisV className="w-4 h-4" />
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default SongList 