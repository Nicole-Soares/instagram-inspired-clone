import { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  
  useEffect(() => {
    setTimeout(() => {
          fetch("http://localhost:7070/user", {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzEiLCJpYXQiOjE3NTkwMDU0ODksImV4cCI6MTc1OTA5MTg4OX0.JCQk5J6uY8DPIfMN8D48RQIOfbGqphExApanfGZQNe8',
            },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Error al obtener el post");
              return res.json();
            })
          
            .then((data) => setPosts(data.timeline)) 
            .catch((err) => console.error("Error:", err))
            .finally(() => setLoading(false))
          }, 1500)
        }, []);

  return (
    <div className="App">
      <h1>Vite + React</h1>
      <h2>Welcome to UNQ-UI</h2>

      {loading && (
        <img src={reactLogo} className="logo react" alt="React logo" />
      )}

      {posts.map(post => (
        <div
          key={post.id}
          className="postCard"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}

      <div className="card">
        <button onClick={() => setCount(count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App
