import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDocs } from "../services/documentService";
import { updateProfilePin } from "../services/authService";

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePin, setProfilePin] = useState("");
  const [pinSaved, setPinSaved] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  let userId = "";
  if (token) {
    try {
      userId = JSON.parse(atob(token.split('.')[1])).id;
    } catch(e) {}
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getDocs(token);
        const validDocs = data.filter(d => !d.expiryDate || new Date(d.expiryDate) > new Date());
        
        // Calculate stats
        const categoryCounts = validDocs.reduce((acc, d) => {
          const cat = d.category || "Others";
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});
        
        let topCategory = "None";
        let maxCount = 0;
        for (const [cat, count] of Object.entries(categoryCounts)) {
          if (count > maxCount) {
            maxCount = count;
            topCategory = cat;
          }
        }

        const alerts = validDocs.filter(d => d.reminderDate && new Date(d.reminderDate) <= new Date(new Date().getTime() + 86400000));
        
        const totalBytes = validDocs.reduce((acc, doc) => acc + (doc.size || 0), 0);
        const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
        const limitMB = 1000;
        const quotaPercentage = Math.min((totalMB / limitMB) * 100, 100).toFixed(1);

        setStats({
          total: validDocs.length,
          topCategory: topCategory,
          categoryCounts: categoryCounts,
          latest: validDocs.slice(0, 3),
          alerts: alerts,
          totalMB,
          limitMB,
          quotaPercentage
        });
        setDocs(validDocs);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleUpdatePin = async () => {
    try {
      await updateProfilePin(profilePin, token);
      setPinSaved(true);
      setTimeout(() => setPinSaved(false), 3000);
    } catch(err) {
      alert("Failed to update Profile PIN");
    }
  };

  const copyPortfolioLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/u/${userId}`);
    alert("Portfolio Link Copied! Send this to HR.");
  };

  return (
    <div>
      <Navbar />
      <div className="container animate-fade-up">
        
        {userId && (
          <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem", display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(90deg, rgba(82, 113, 255, 0.1), rgba(16, 185, 129, 0.1))" }}>
            <div style={{ flex: "1 1 300px" }}>
              <h3 style={{ margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🌍</span> Public HR Portfolio
              </h3>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>Documents you mark explicitly as "Public" will magically appear here for external companies.</p>
              <button 
                onClick={copyPortfolioLink} 
                style={{ marginTop: "1rem", padding: "8px 16px", fontSize: "0.85rem", background: "var(--accent-light)", color: "#fff" }}
              >
                🔗 Copy Portfolio Link
              </button>
            </div>
            
            <div style={{ flex: "1 1 250px", background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "12px" }}>
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Master PIN for Portfolio (Optional)</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <input 
                  type="password" 
                  maxLength="4" 
                  placeholder="e.g. 5555" 
                  value={profilePin} 
                  onChange={(e) => setProfilePin(e.target.value)}
                  style={{ width: "100%", padding: "8px", textAlign: "center", letterSpacing: "5px" }} 
                />
                <button onClick={handleUpdatePin} style={{ padding: "8px 16px", background: pinSaved ? "#10b981" : "var(--accent-dark)" }}>
                  {pinSaved ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {token && !loading && stats && (
          <div className="glass-panel" style={{ marginBottom: "2.5rem", padding: "2rem" }}>
            <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.4rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>📊 Storage Efficiency</span>
              <span style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: "500" }}>{stats.totalMB} MB / {stats.limitMB} MB</span>
            </h3>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${stats.quotaPercentage}%` }}></div>
            </div>
            <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "right", fontWeight: "600" }}>
              {stats.quotaPercentage}% Infrastructure Capacity Used
            </p>
          </div>
        )}

        <div className="glass-panel" style={{ textAlign: "center", padding: "5rem 2rem", marginBottom: "3rem", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent 50%)" }}>
          <h1 style={{ marginBottom: "1rem", letterSpacing: "-2px" }}>DocuSphere <span style={{ color: "var(--accent-light)" }}>Elite</span></h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.25rem", marginBottom: "3rem", maxWidth: "600px", margin: "0 auto 3rem" }}>
            Your enterprise-grade, blazing-fast personal document vault. Secure, categorized, and AI-powered.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}>
            <Link to="/upload">
              <button style={{ padding: "14px 32px" }}>✨ New Upload</button>
            </Link>
            <Link to="/documents">
              <button style={{ background: "transparent", border: "1px solid var(--glass-border)", color: "var(--text-main)", padding: "14px 32px" }}>
                🏺 Archival Vault
              </button>
            </Link>
          </div>
        </div>

        {token && !loading && stats && stats.alerts.length > 0 && (
          <div className="glass-panel" style={{ marginBottom: "3rem", border: "1px solid var(--danger)", background: "rgba(239, 68, 68, 0.05)" }}>
            <h3 style={{ marginBottom: "1.5rem", color: "var(--danger)", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>⚠️</span> Action Required: Alerts
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {stats.alerts.map(doc => (
                <div key={`alert-${doc._id}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(0,0,0,0.4)", borderRadius: "8px" }}>
                  <div>
                    <span style={{ fontWeight: "600", color: "#fff" }}>{doc.title}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginLeft: "10px" }}>Reminder reached!</span>
                  </div>
                  <button onClick={() => navigate(`/doc/${doc._id}`)} style={{ padding: "6px 16px", fontSize: "0.8rem", background: "var(--danger)", color: "#fff" }}>
                    Review Document
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {token && !loading && stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
            <div className="glass-panel" style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗂️</div>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem", color: "var(--accent-light)" }}>{stats.total}</h3>
              <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: "500" }}>Total Documents</p>
            </div>
            
            <div className="glass-panel" style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem", color: "var(--accent-light)", textTransform: "capitalize" }}>{stats.topCategory}</h3>
              <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: "500" }}>Primary Category</p>
            </div>

            <div className="glass-panel" style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛡️</div>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem", color: "#10b981" }}>Active</h3>
              <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: "500" }}>Vault Status</p>
            </div>
          </div>
        )}

        {token && !loading && stats && stats.total > 0 && (
          <div className="glass-panel" style={{ padding: "2.5rem", marginBottom: "3rem" }}>
            <h3 style={{ marginBottom: "2rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem", fontSize: "1.5rem" }}>Storage Distribution Chart</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {Object.entries(stats.categoryCounts).sort((a,b) => b[1]-a[1]).map(([cat, count]) => (
                <div key={cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "1rem", color: "var(--text-main)", textTransform: "capitalize", fontWeight: "500" }}>{cat}</span>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>{count} file{count !== 1 ? 's' : ''} ({Math.round((count / stats.total) * 100)}%)</span>
                  </div>
                  <div style={{ width: "100%", height: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", borderRadius: "8px", overflow: "hidden" }}>
                    <div style={{ 
                      width: `${(count / stats.total) * 100}%`, 
                      height: "100%", 
                      background: "linear-gradient(90deg, var(--accent-light), var(--accent-dark))",
                      borderRadius: "8px"
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {token && !loading && stats?.latest?.length > 0 && (
          <div className="glass-panel" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h3 style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem", fontSize: "1.5rem" }}>Recently Added</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {stats.latest.map(doc => (
                <div key={doc._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "1.5rem", filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.5))" }}>{doc.fileUrl?.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? '🖼️' : '📄'}</span>
                    <span style={{ fontWeight: "500", textTransform: "capitalize" }}>{doc.title}</span>
                  </div>
                  <button onClick={() => navigate(`/doc/${doc._id}`)} style={{ padding: "6px 16px", fontSize: "0.8rem", background: "transparent", border: "1px solid var(--accent-light)", color: "var(--accent-light)" }}>
                    Open
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}