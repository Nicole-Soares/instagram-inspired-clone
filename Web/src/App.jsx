import { useEffect, useState } from 'react'
import { data, useNavigate } from 'react-router'
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
              'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzEiLCJpYXQiOjE3NTg4NDY4ODEsImV4cCI6MTc1ODkzMzI4MX0.66yEHFAs9VF6r4XwJ0YmQw5sLAkLPIloRc4XmnVS9WU',
            },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Error al obtener el post");
              return res.json();
            })
          
            .then((data) => setPosts(data.timeline)) 
            console.log(data)
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
