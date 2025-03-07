import React from 'react'
import Home from '../Home'
import Navbar from './components/NavBar'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'


const App = () => {
  return (
    <>
    <Toaster
  position="top-center"
  reverseOrder={false}
/>
    <Navbar/>
    {/* // dummy commit */}
    <Home/>
    {/* <Footer/> */}
    </>
  )
}

export default App