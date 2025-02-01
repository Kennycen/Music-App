import React from 'react'
import { FaSearch } from 'react-icons/fa'

const SearchBar = ({ value, onChange, placeholder }) => {
  const handleChange = (e) => {
    onChange(e.target.value.toLowerCase())
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <FaSearch className="absolute left-3 top-3 text-gray-400" />
    </form>
  )
}

export default SearchBar 