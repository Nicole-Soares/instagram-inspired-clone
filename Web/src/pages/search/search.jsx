import { useState, useEffect } from "react";
import PostCard from "./components/postCard.jsx";
import PostGrid from "./components/postGrid.jsx";
import UserCard from "./components/userCard.jsx";
import UsersContainer from "./components/usersContainer.jsx";
import { searchContent } from "../../service/searchService.js";
import "../../style/search.css";
import { Link } from 'react-router';
import { Storage} from "../../service/storage.js";
import { useNavigate, useSearchParams } from "react-router";



function Search() {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

   useEffect(() => {
    if (queryParam) {
      handleSearch(queryParam);
      setQuery(queryParam)
    } else {
      setResults({ users: [], posts: [] });
    }
  }, [queryParam]); 

  /*useEffect(() => {
    const token = Storage.getToken();
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);*/ // Si no esta logueado, redirige a login

  const handleSearch = async (value) => {

    if (!value.trim()) {
      setResults({ users: [], posts: [] });
      return;
    }

    setLoading(true);
   
    const data = await searchContent(value);
    setResults(data);

    setLoading(false);
  };

   const handleSubmit  = (e) => { // Eliminar con el sidebar
    e.preventDefault(); 
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="search-page">
      <div className="search-bar">
      <form onSubmit={handleSubmit}>  {/* Reemplazar por el sidebar */}
        <input 
            type="search"
            placeholder="Buscar usuarios o tags..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="search-input"
          />
        </form>
        </div>
      <div className="search-container">  
        <p className="search-query"> {loading ? "Buscando..." : queryParam ? `[${queryParam}]` : ""}</p>

        {/* users */}
        {results.users.length > 0 && (
          <UsersContainer>
            {results.users.map(u => (
              <Link key={u.id} to={`/user/${u.id}`}>
                <UserCard key={u.id} src={u.image} />
              </Link>
            ))}
          </UsersContainer>
        )}

        {/*posts */}
        {results.posts.length > 0 && (
          <PostGrid>
            {results.posts.map(p => (
             <Link key={p.id} to={`/post/${p.id}`}>
                <PostCard src={p.image} />
             </Link>
            ))}
          </PostGrid>
        )}

        {/* no results */}
        {queryParam && !loading && results.users.length === 0 && results.posts.length === 0 && (
          <p className="no-results">NO SE ENCONTRARON RESULTADOS!</p>
        )}
      </div>
    </div>
  );
}

export default Search;