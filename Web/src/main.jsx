import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Post from './pages/post/Post.jsx'
import AgregarPost from './pages/agregarPost/AgregarPost.jsx'
import PostEdit from './pages/postEdit/PostEdit.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './pages/auth/Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/post/agregarPost" element={<AgregarPost />} />
        <Route path="/post/editPost/:id" element={<PostEdit />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

