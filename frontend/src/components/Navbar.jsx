import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaMusic, FaBook } from 'react-icons/fa'

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 fixed bottom-0 left-0 right-0 z-10 h-16">
      <div className="container mx-auto flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center hover:text-gray-300">
          <FaHome className="mb-1" /> <span className="text-xs">Home</span>
        </Link>
        <Link to="/panel" className="flex flex-col items-center hover:text-gray-300">
          <FaMusic className="mb-1" /> <span className="text-xs">Panel</span>
        </Link>
        <Link to="/library" className="flex flex-col items-center hover:text-gray-300">
          <FaBook className="mb-1" /> <span className="text-xs">Library</span>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar