import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import LoginPage from './pages/LoginPage'
import NotFound from './pages/NotFound'
import BookNow from './pages/BookNow'
import Experiences from './pages/Experiences'
import Destinations from './pages/DestinationsPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute requireAuth={false} />}>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/bookNow" element={<BookNow />} />
              <Route path="/experiences" element={<Experiences />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
