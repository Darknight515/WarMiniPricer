import { useState } from 'react'
import { Routes, Route, Link } from "react-router-dom";
import './App.css'
import NavBar from "./components/NavBar"
import Home from './pages/Home';
import About from './pages/About';
import Factions from './pages/Factions';
import MiniDetail from './pages/MiniDetail';
import RecentChanges from './pages/RecentChanges';
import { MiniProvider } from './contexts/MiniContext';

function App() {

  return (
    <div className="bg-[var(--color-off-white)] h-screen overflow-hidden flex flex-col">
      <MiniProvider>
        <NavBar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/factions" element={<Factions />} />
            <Route path="/mini/:miniId" element={<MiniDetail />} />
            <Route path="/recent-changes" element={<RecentChanges />} />
          </Routes>
        </main>
      </MiniProvider>
    </div>
  )
}

export default App
