import React,{ useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Home from './Pages/Home/Home';
import Courses from './Pages/courses/Courses';
import EmailConfirmation from './Pages/emailConfirmation/emailConfirmation';
import './App.css';


function App() {

  return (
   <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/emailConfirmation/:token" element={<EmailConfirmation />} />
          <Route path="/" element={<Layout />}>

            <Route index element={<Home />} /> 
            <Route path="courses" element={<Courses />} />
         
          </Route>
        </Routes>
   </Router>
  )
}

export default App
