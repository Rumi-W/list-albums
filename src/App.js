import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Albums from './components/Albums'
import FavoriteAlbums from './components/FavoriteAlbums'

import './App.css'

const App = () => {
    return (
        <div className="fade-in">
            <CssBaseline />
            <Routes>
                <Route exact path="/" element={<Albums />} />
                <Route path="favorites" element={<FavoriteAlbums />} />
            </Routes>
        </div>
    )
}

export default App
