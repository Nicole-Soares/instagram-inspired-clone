import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Post from "./pages/post/Post.jsx";
import AgregarPost from "./pages/agregarPost/AgregarPost.jsx";
import PostEdit from "./pages/postEdit/PostEdit.jsx";
import Login from "./pages/auth/Login.jsx";
import Home from "./pages/home/Home.jsx";
import Register from "./pages/auth/Register.jsx";
import UserProfile from "./pages/profile/UserProfile.jsx";
import Search from "./pages/search/search.jsx";
import { isLoggedIn } from "./service/storage.js";
import NotFoundModal from "./generalComponents/modals/NotFoundModal.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={!isLoggedIn() ? <Navigate to="/login" /> : <Home />}
        />
        <Route path="/post/:id" element={!isLoggedIn() ? <Navigate to="/login" /> : <Post />} />
        <Route path="/post/agregarPost" element={!isLoggedIn() ? <Navigate to="/login" /> : <AgregarPost />} />
        <Route path="/post/editPost/:id" element={!isLoggedIn() ? <Navigate to="/login" /> : <PostEdit />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={!isLoggedIn() ? <Navigate to="/login" /> : <Search />} />
        <Route path="/user/:userId" element={!isLoggedIn() ? <Navigate to="/login" /> : <UserProfile />} />
        <Route path="*" element={<NotFoundModal />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
