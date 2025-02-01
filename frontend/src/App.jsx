import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Panel from './pages/Panel'
import Library from './pages/Library'
import Playlist from './pages/Playlist'
import PlaylistView from './pages/PlaylistView'
import Navbar from './components/Navbar'
import Logo from './components/Logo'
import { AudioProvider } from './contexts/AudioContext'

const App = () => {
  return (
    <AudioProvider>
      <div className="pb-16 pt-16">
        <Logo />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/panel' element={<Panel/>} />
          <Route path='/library' element={<Library />} />
          <Route path='/create-playlist' element={<Playlist />} />
          <Route path='/playlist/:playlistId' element={<PlaylistView />} />
        </Routes>
        <Navbar />
      </div>
    </AudioProvider>
  )
}

export default App