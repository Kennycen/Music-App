import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { formatTime } from '../utils/formatTime'
import axios from 'axios'

const AudioContext = createContext()

export const AudioProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playlist, setPlaylist] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(new Audio())
  const [isAudioReady, setIsAudioReady] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

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
    const audio = audioRef.current

    // Setup audio context for iOS
    const initializeAudio = () => {
      if (!isAudioReady) {
        audio.load()
        setIsAudioReady(true)
      }
    }

    // Add touch/click listener to initialize audio
    document.addEventListener('touchstart', initializeAudio, { once: true })
    document.addEventListener('click', initializeAudio, { once: true })

    return () => {
      document.removeEventListener('touchstart', initializeAudio)
      document.removeEventListener('click', initializeAudio)
    }
  }, [isAudioReady])

  useEffect(() => {
    const handleUserInteraction = () => {
      initializeAudio()
    }

    // Listen for any user interaction
    document.addEventListener('touchstart', handleUserInteraction, { once: true })
    document.addEventListener('click', handleUserInteraction, { once: true })

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction)
      document.removeEventListener('click', handleUserInteraction)
    }
  }, [])

  useEffect(() => {
    if (currentSong && isInitialized) {
      audioRef.current.src = currentSong.audioUrl
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error)
          setIsPlaying(false)
        })
      }
    }
  }, [currentSong, isPlaying, isInitialized])

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

  const playSong = async (song) => {
    try {
      if (currentSong?._id === song._id && isPlaying) {
        setIsPlaying(false)
        audioRef.current.pause()
      } else {
        setCurrentSong(song)
        if (isAudioReady) {
          setIsPlaying(true)
        }
      }
    } catch (error) {
      console.error('Error playing song:', error)
    }
  }

  const playPlaylist = (songs, startIndex = 0) => {
    if (songs && songs.length > 0) {
      setPlaylist(songs)
      setCurrentIndex(startIndex)
      setCurrentSong(songs[startIndex])
    }
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

  const seekTo = (time) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        playlist,
        currentIndex,
        playSong,
        playPlaylist,
        togglePlay,
        nextSong,
        previousSong,
        seekTo,
        formatTime,
        isInitialized
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