import React from 'react'
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa'
import { useAudio } from '../contexts/AudioContext'

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    previousSong
  } = useAudio()

  return (
    <div className="bg-gray-100 p-4 sm:p-6 rounded-lg mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl sm:text-2xl font-semibold">Now Playing</h2>
          <p className="text-gray-600">{currentSong?.title || 'No song selected'}</p>
          {currentSong?.artist && (
            <p className="text-gray-500 text-sm">{currentSong.artist}</p>
          )}
        </div>
        <div className="flex items-center justify-center sm:justify-end space-x-4">
          <button 
            className="p-2 rounded-full hover:bg-gray-200"
            onClick={previousSong}
          >
            <FaStepBackward />
          </button>
          <button 
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            onClick={togglePlay}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button 
            className="p-2 rounded-full hover:bg-gray-200"
            onClick={nextSong}
          >
            <FaStepForward />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer 