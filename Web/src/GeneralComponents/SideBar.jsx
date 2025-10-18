import React, { useState } from "react";
import { Link, useNavigate, useMatch } from "react-router-dom";
import Storage from '../service/storage';
import textLogo from '../assets/instagram-text-logo.svg';
import searchIcon from '../assets/search-logo.png';
import homeLogo from '../assets/instagram-home-icon.png';
import createPostLogo from '../assets/instagram-create-post-icon.png';
import logoutLogo from '../assets/instagram-salir-logo.png';
import '../style/GeneralComponents/SideBar.css'

const SideBar = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const isHomeActive = useMatch('/home');
    const isProfileActive = useMatch('/user/:userId');
    const isCreatePostActive = useMatch('/post/agregarPost');
    const meId = Storage.getUserId();
    const avatarImage = Storage.getAvatarImage();

    const handleLogOut = () => {
        Storage.clearToken(); 
        // para que le de tiempo al storage de sincronizarse y cuando vaya al login no entre directo al home y aparezca el modal de no autorizado
        setTimeout(() => navigate('/login'), 0); 
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const inputLimpio = searchInput.trim();

        if(inputLimpio) {
            navigate(`/search?q=${encodeURIComponent(inputLimpio)}`);
            setSearchInput('');
        }
    };

    return (
        <div className="sidebar-container">
            <Link to="/home" className="sidebar-logo-link">
                <img
                    src={textLogo}
                    alt="Instagram logo"
                    className="sidebar-logo-image"
                />
            </Link>
            <form className="sidebar-search" onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="sidebar-search-input"
                    id="search-inpu"
                    name="search-query"
                    autoComplete="off"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                />
                
                <button
                    type="submit"
                    className="search-icon-button"
                    aria-label="Buscar"
                >
                    <img
                        src={searchIcon}
                        alt="Search icon"
                        className="search-icon-image"
                    />
                </button>        
            </form>

            <nav className="sidebar-nav">
                <div className="sidebar-home">
                    <Link to="/home" className={isHomeActive ? "nav-link nav-link-active" : "nav-link"}>
                        <img
                        src={homeLogo}
                        alt="Home logo"
                        className="sidebar-home-logo"
                        />
                        Inicio
                    </Link>
                </div>

                <div>
                    <Link to="/post/agregarPost" className={isCreatePostActive ? "nav-link nav-link-active" : "nav-link"}>
                        <img
                            src={createPostLogo}
                            alt="Create post logo"
                            className="sidebar-create-post-logo"
                        />
                        Crear publicación
                    </Link>
                </div>
                <div>
                    <Link to={`/user/${meId}`} className={isProfileActive ? "nav-link nav-link-active" : "nav-link"}>
                        <img
                            src={avatarImage}
                            alt="User avatar"
                            className="sidebar-profile-avatar"
                        />
                        Perfil
                    </Link>                    
                </div>    
            </nav>

            <Link onClick={handleLogOut} className="nav-link">
                <img
                    src={logoutLogo}
                    alt="Logout logo"
                    className="sidebar-logout-logo"
                />
                Salir
            </Link>
        </div>
    )
}
 
export default SideBar;