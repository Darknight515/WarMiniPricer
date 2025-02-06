import { useState } from 'react'
import {Routes, Route, Link} from "react-router-dom";
import './App.css'
import NavBar from "./components/NavBar"
import Home from './pages/Home';
import About from './pages/About';
import Factions from './pages/Factions';

function App() {

  return (
    <>
      <NavBar />
      <main className='main-content'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/factions' element={<Factions />}/>
      </Routes>
      </main>
</>
  )
}

export default App
