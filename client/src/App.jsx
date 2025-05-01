import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import EmailVerify from './pages/EmailVerify';
import JournalForm from './pages/JournalForm';
import JournalList from './pages/JournalList';
import { ToastContainer } from 'react-toastify';
  

const App = () => {
  return (
    <div>
        <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path="/journal/new" element={<JournalForm />} />
        <Route path='/journal' element={<JournalList />} />
      </Routes>
    </div>
  )
}

export default App