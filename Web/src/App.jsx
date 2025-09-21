import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/posts")
        .then(res => res.json())
        .then(data => setPosts(data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }, 1500)
  }, [])

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
