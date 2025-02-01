import React, { useState } from 'react'
import { FaUpload } from 'react-icons/fa'
import api from '../config/axios'

const Home = () => {
  const [file, setFile] = useState(null)
  const [songName, setSongName] = useState("")
  const [artist, setArtist] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile)
      setError("")
    } else {
      setError("Please select an audio file")
      setFile(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !songName) {
      setError("Please provide a song name and audio file")
      return
    }

    setIsUploading(true)
    setError("")

    const formData = new FormData()
    formData.append('audio', file)
    formData.append('title', songName)
    if (artist.trim()) {
      formData.append('artist', artist)
    }

    try {
      await api.post('/api/songs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // Reset form
      setFile(null)
      setSongName("")
      setArtist("")
      alert('Song uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      setError(error.response?.data?.error || 'Failed to upload song')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload Music</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audio File
            </label>
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="audio/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">MP3, WAV up to 10MB</p>
                {file && (
                  <p className="text-sm text-gray-600">Selected: {file.name}</p>
                )}
              </div>
            </div>
          </div>

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
            type="submit"
            disabled={isUploading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload Music'}
          </button>
        </form>

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