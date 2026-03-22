import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const mockUsers = [
  { id: 1, name: "Alice Johnson", role: "Product Designer", avatar: "👩‍🎨" },
  { id: 2, name: "Bob Smith", role: "Software Engineer", avatar: "👨‍💻" },
  { id: 3, name: "Charlie Davis", role: "Marketing Manager", avatar: "👨‍💼" },
  { id: 4, name: "Diana Prince", role: "Creator", avatar: "🦸‍♀️" },
  { id: 5, name: "Evan Wright", role: "Content Creator", avatar: "👨‍🎤" },
];

const recentSearches = ["Alice Johnson", "Marketing strategies"];

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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
                   {mockUsers.slice(0, 2).map(u => (
                     <div key={u.id} className="search-item friend-item" onClick={() => navigate(`/profile/${u.id}`)}>
                       <span className="avatar">{u.avatar}</span>
                       <div>
                          <div className="friend-name">{u.name}</div>
                          <div className="friend-role">{u.role}</div>
                       </div>
                     </div>
                   ))}
                 </>
               ) : (
                 <>
                   {mockUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                     mockUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                       <div key={u.id} className="search-item friend-item" onClick={() => navigate(`/profile/${u.id}`)}>
                         <span className="avatar">{u.avatar}</span>
                         <div>
                            <div className="friend-name">{u.name}</div>
                            <div className="friend-role">{u.role}</div>
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