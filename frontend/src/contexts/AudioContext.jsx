import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { formatTime } from '../utils/formatTime'
import axios from 'axios'

const AudioContext = createContext()

export const AudioProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const [playlist, setPlaylist] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(new Audio())

  useEffect(() => {
    const audio = audioRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleDurationChange = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
    }
  }, [])

  useEffect(() => {
    // Set initial volume
    audioRef.current.volume = volume / 100
  }, [])

  useEffect(() => {
    // Update volume when it changes
    audioRef.current.volume = volume / 100
  }, [volume])

  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.audioUrl
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error)
        })
      }
      setCurrentTime(0)
    }
  }, [currentSong])

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Handle song end and auto-play next
  useEffect(() => {
    const audio = audioRef.current

    const handleSongEnd = () => {
      if (playlist.length > 0) {
        const nextIndex = currentIndex + 1
        if (nextIndex < playlist.length) {
          // Play next song
          setCurrentIndex(nextIndex)
          setCurrentSong(playlist[nextIndex])
          setIsPlaying(true)
        } else {
          // End of playlist
          setIsPlaying(false)
          setCurrentIndex(0)
          setCurrentTime(0)
        }
      }
    }

    audio.addEventListener('ended', handleSongEnd)
    return () => audio.removeEventListener('ended', handleSongEnd)
  }, [playlist, currentIndex])

  useEffect(() => {
    const audio = audioRef.current

    const handleLoadedMetadata = () => {
      const duration = audio.duration
      const minutes = Math.floor(duration / 60)
      const seconds = Math.floor(duration % 60)
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`
      
      // Update song duration in database if it's '0:00'
      if (currentSong && currentSong.duration === '0:00') {
        axios.patch(`${import.meta.env.VITE_API_URL}/api/songs/${currentSong._id}`, {
          duration: formattedDuration
        }).catch(error => {
          console.error('Error updating song duration:', error)
        })
      }
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    return () => audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
  }, [currentSong])

  const playSong = (song) => {
    if (currentSong?._id === song._id && isPlaying) {
      setIsPlaying(false)
    } else {
      setCurrentSong(song)
      setIsPlaying(true)
    }
  }

  const playPlaylist = (songs, startIndex = 0) => {
    setPlaylist(songs)
    setCurrentIndex(startIndex)
    setCurrentSong(songs[startIndex])
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const nextSong = () => {
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentSong(playlist[nextIndex])
      setIsPlaying(true)
    }
  }

  const previousSong = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      setCurrentSong(playlist[prevIndex])
      setIsPlaying(true)
    }
  }

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume)
  }

  const seekTo = (time) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        currentTime,
        duration,
        playlist,
        currentIndex,
        playSong,
        playPlaylist,
        togglePlay,
        nextSong,
        previousSong,
        handleVolumeChange,
        seekTo,
        formatTime
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
} 