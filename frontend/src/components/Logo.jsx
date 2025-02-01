import React from 'react'
import { Link } from 'react-router-dom'
import { FaMusic } from 'react-icons/fa'

const Logo = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-20">
      <div className="container mx-auto px-4">
        <Link to="/" className="flex items-center py-4 space-x-2">
          <FaMusic className="text-blue-500 text-2xl" />
          <span className="text-xl font-bold text-gray-800">Music App</span>
        </Link>
      </div>
    </div>
  )
}

export default Logo