import React, { useState } from 'react'
import { FaUpload } from 'react-icons/fa'
import api from '../config/axios'
import CloudinaryUploadWidget from '../components/CloudinaryUploadWidget'

const Home = () => {
  const [songName, setSongName] = useState("")
  const [artist, setArtist] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleUploadSuccess = async (result) => {
    try {
      if (!songName) {
        setError("Please provide a song name")
        return
      }

      setIsUploading(true)
      setError("")

      const response = await api.post('/api/songs', {
        title: songName,
        artist: artist || 'Unknown Artist',
        audioUrl: result.audioUrl,
        cloudinaryId: result.cloudinaryId,
        duration: '0:00'
      })

      // Reset form
      setSongName("")
      setArtist("")
      setUploadedFile(null)
      alert('Song uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      setError(error.response?.data?.error || 'Failed to save song')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUploadError = (error) => {
    setError('Upload failed: ' + error.message)
    setIsUploading(false)
  }

  const openUploadWidget = () => {
    if (!songName) {
      setError("Please provide a song name first")
      return
    }
    
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
        apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
        sources: ['local'],
        multiple: false,
        maxFileSize: 25000000,
        resourceType: 'video',
        folder: 'music-app',
        allowedFormats: ['mp3', 'wav'],
        maxChunkSize: 2000000,
      },
      (error, result) => {
        if (!error && result) {
          switch (result.event) {
            case 'success':
              handleUploadSuccess({
                audioUrl: result.info.secure_url,
                cloudinaryId: result.info.public_id,
              })
              setUploadProgress(100)
              break;
            case 'progress':
              setUploadProgress(result.data.percent)
              break;
            case 'error':
              handleUploadError(result.error)
              setUploadProgress(0)
              break;
          }
        }
        if (error) {
          handleUploadError(error)
          setUploadProgress(0)
        }
      }
    )
    widget.open()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload Music</h1>
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Song Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Artist <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="button"
            onClick={openUploadWidget}
            disabled={isUploading || !songName}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Choose File & Upload'}
          </button>
        </form>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Uploading: {Math.round(uploadProgress)}%
            </p>
          </div>
        )}

        <div className="mt-8 bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-4">How to Upload</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Click the upload area or drag and drop your audio file.</li>
            <li>Enter the song name (required).</li>
            <li>Optionally enter the artist name.</li>
            <li>Click the "Upload Music" button to start the upload process.</li>
            <li>Wait for the upload to complete.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default Home