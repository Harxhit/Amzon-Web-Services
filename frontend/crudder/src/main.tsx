import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Login, SignUp } from './components'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MainLayout from './layouts/mainLayout'
import Home from './pages/home/Home'
import Notifications from './pages/notification/Notification'
import Profile from './pages/profile/Profile'
import More from './pages/more/More'
import {AuthProvider }from './context/AuthProvider'
import ProtectedLayout from './routes/ProtectedRoute'
import Tweet from './pages/tweet/Tweet'
import Message from './pages/message/Message'
import Chat from './pages/chat/Chat'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route element={<ProtectedLayout/>}>
      <Route element={<MainLayout />}>
        <Route path='/home' element={<Home />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/message' element={<Message />} />
        <Route path='/chat/:id' element={<Chat />} />
        <Route path='/tweet' element={<Tweet/>}/>
        <Route path='/more' element={<More/>}/>
      </Route>
      </Route>
    </>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </StrictMode>,
)
