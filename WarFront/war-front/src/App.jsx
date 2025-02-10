import { useState } from 'react'
import {Routes, Route, Link} from "react-router-dom";
import './App.css'
import NavBar from "./components/NavBar"
import Home from './pages/Home';
import About from './pages/About';
import Factions from './pages/Factions';
import MiniDetail from './pages/MiniDetail';
import { MiniProvider } from './contexts/MiniContext';

function App() {

  return (
    <>
    <MiniProvider>
      <NavBar />
      <main className='main-content min-h-screen'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/factions' element={<Factions />}/>
        <Route path="/mini/:miniId" element={<MiniDetail />} />
      </Routes>
      </main>
    </MiniProvider>
    </>
  )
}

export default App
