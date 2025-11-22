import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/collection'
import About from './pages/about'
import Contact from './pages/contact'
import Product from './pages/product'
import Cart from './pages/Cart'
import Login from './pages/login'
import Orders from './pages/Orders'
import PlaceOrder from './pages/placeOrder'
import Navbar from './components/navbar'
import Footer from './components/Footer';
import SearchBar from './components/searchBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <div className= 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
    <ToastContainer />
    <Navbar />
    <SearchBar />
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productID' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/place-Order' element={<PlaceOrder />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App