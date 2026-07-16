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
import DestinationDetail from './pages/DestinationDetail'
import ProfilePage from './pages/ProfilePage'
import ProfileListPage from './pages/ProfileListPage'
import AddDestinationPage from './pages/AddDestinationPage'
import EditDestinationPage from './pages/EditDestinationPage'
import ScrollToTop from './components/ScrollToTop'
import TripPlanner from './pages/TripPlanner'

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LoginPage />} />
         
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute requireAuth={false} />}>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path='/destinationDetail/:id' element={<DestinationDetail/>}/>

              {/* for testing  */}
               <Route path="/planner" element={<TripPlanner/>}/>
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/bookNow" element={<BookNow />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:section" element={<ProfileListPage />} />
              <Route path="/destinations/new" element={<AddDestinationPage />} />
              <Route path="/destinations/:id/edit" element={<EditDestinationPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
