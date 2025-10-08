import { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router'
import reactLogo from './assets/react.svg'
import './App.css'
import Storage from './service/storage'


function App() {
  const [count, setCount] = useState(0)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const token = Storage.getToken();

const headers = {
    'Content-Type': 'application/json',
    'Authorization': (token),
};
  useEffect(() => {
    setTimeout(() => {
          fetch("http://localhost:7070/user", {
            method: 'GET', 
            headers: headers,
          })
            .then((res) => {
              if(res.status === 401){
        
                // Eliminar el token de localStorage 
                Storage.clearToken();
                // Redirigir al usuario
                navigate(`/login`);
                // Lanzar un error para detener la cadena .then()
                throw new Error("Unauthorized");
              }
              if (!res.ok){ 
                throw new Error("Error al obtener el post");
              }
              return res.json();
            })
          
            .then((data) => setPosts(data.timeline)) 
            .catch((err) => console.error("Error:", err))
            .finally(() => setLoading(false))
          }, 1500)
        }, [navigate]);

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
