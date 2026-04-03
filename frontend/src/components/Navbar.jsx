import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "../services/apiBase";

const recentSearches = ["Alice Johnson", "Marketing strategies"];

export default function Navbar() {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);
  
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [friendResults, setFriendResults] = useState([]);

  useEffect(() => {
    if (!token || !isSearchFocus) {
      setFriendResults([]);
      return;
    }

    const timerId = setTimeout(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/users/search`, {
          params: { q: searchQuery },
          headers: { Authorization: `Bearer ${token}` }
        });
        setFriendResults(response.data || []);
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
        }
        setFriendResults([]);
      }
    }, 250);

    return () => clearTimeout(timerId);
  }, [searchQuery, token, isSearchFocus, logout]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navigateToFriend = (friendId) => {
    navigate(`/u/${friendId}`);
    setSearchQuery("");
    setIsSearchFocus(false);
  };

  return (
    <nav>
      <div className="nav-brand" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>DocuSphere</div>
      
      <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? "✖" : "☰"}
      </button>

      <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search friends or docs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocus(true)}
            onBlur={() => setTimeout(() => setIsSearchFocus(false), 200)}
            className="search-input"
          />
          {isSearchFocus && (
             <div className="search-dropdown">
               {searchQuery === "" ? (
                 <>
                   <div className="dropdown-header">Recent Searches</div>
                   {recentSearches.map(s => <div key={s} className="search-item" onClick={() => setSearchQuery(s)}>🕒 {s}</div>)}
                   <div className="dropdown-header">Suggested Friends</div>
                   {friendResults.length > 0 ? friendResults.slice(0, 3).map(u => (
                     <div key={u._id} className="search-item friend-item" onClick={() => navigateToFriend(u._id)}>
                       <span className="avatar">👤</span>
                       <div>
                          <div className="friend-name">{u.name}</div>
                          <div className="friend-role">@{u.username || "user"}</div>
                       </div>
                     </div>
                   )) : <div className="search-item">No friend suggestions yet</div>}
                 </>
               ) : (
                 <>
                   {friendResults.length > 0 ? (
                     friendResults.map(u => (
                       <div key={u._id} className="search-item friend-item" onClick={() => navigateToFriend(u._id)}>
                         <span className="avatar">👤</span>
                         <div>
                            <div className="friend-name">{u.name}</div>
                            <div className="friend-role">@{u.username || "user"}</div>
                         </div>
                       </div>
                     ))
                   ) : (
                     <div className="search-item">No friends found for "{searchQuery}"</div>
                   )}
                 </>
               )}
             </div>
          )}
        </div>

        <button onClick={toggleTheme} style={{ background: "transparent", border: "1px solid var(--glass-border)", padding: "6px 12px", color: "var(--text-main)", borderRadius: "20px" }}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/upload">Upload</Link>
            <Link to="/documents">Vault</Link>
            <Link to="/trash">🗑️ Bin</Link>
            <Link to="/profile">👤 Profile</Link>
            <button onClick={handleLogout} className="danger-btn" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}