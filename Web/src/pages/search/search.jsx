import { useState, useEffect } from "react";
import PostCard from "../../GeneralComponents/PostGrid/PostCard.jsx";
import PostGrid from "../../GeneralComponents/PostGrid/PostGrid.jsx";
import UserCard from "./components/userCard.jsx";
import UsersContainer from "./components/usersContainer.jsx";
import { searchContent } from "../../service/search/searchService.js";
import "../../style/Search/Search.css";
import { Link, useSearchParams } from "react-router";
import SideBar from '../../generalComponents/SideBar';
import Storage from "../../service/storage.js";
import UnauthorizedModal from "../../GeneralComponents/modals/UnauthorizedModal.jsx";


function Search() {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const token = Storage.getToken();

  useEffect(() => {
    if (!token || Storage.isTokenExpired()) {
      setIsUnauthorized(true);
      return;
    }
    
    if (queryParam) {
      handleSearch(queryParam);
    } else {
      setResults({ users: [], posts: [] });
    }
  }, [token, queryParam]);

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

 
   if (isUnauthorized) {
        return <UnauthorizedModal />;
    }

  return (
    <div className="search-page">
      
      <SideBar/>

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
                <PostCard key={p.id} id={p.id} src={p.image} />   
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