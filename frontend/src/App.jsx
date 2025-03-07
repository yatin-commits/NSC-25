import React from 'react'
import Home from '../Home'
import Navbar from './components/NavBar'
import Footer from './components/Footer'
import Faqs from './components/Faqs'
import Coordinators from './components/Coordinators'


const App = () => {
  return (
    <>
    <Navbar/>
    <Home/>
    <Coordinators/>
    <Faqs/>
    <Footer/>
    </>
  )
}

export default App