import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import Post from './pages/post/Post.jsx'
import AgregarPost from './pages/agregarPost/AgregarPost.jsx'
import PostEdit from './pages/postEdit/PostEdit.jsx'
import Login from './pages/auth/Login.jsx'
import Home from './pages/home/Home.jsx'
import Register from './pages/auth/Register.jsx'
import UserProfile from './pages/profile/UserProfile.jsx';
import Search from './pages/search/search.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ToastContainer position="top-right" autoClose={1000} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/post/agregarPost" element={<AgregarPost />} />
        <Route path="/post/editPost/:id" element={<PostEdit />} />
        <Route path="/register" element={<Register />} />
        <Route path='/search' element={<Search />} />
        <Route path="/user/:userId" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

