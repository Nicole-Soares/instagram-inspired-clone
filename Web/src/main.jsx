import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Post from './pages/post/Post.jsx'
import AgregarPost from './pages/agregarPost/AgregarPost.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/post/agregarPost" element={<AgregarPost />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

