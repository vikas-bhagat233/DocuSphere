import { useEffect, useState, useMemo } from "react";
import { getDocs, deleteDoc } from "../services/documentService";
import DocumentCard from "../components/DocumentCard";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const loadDocs = async () => {
      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        setError("");
        const data = await getDocs(token);
        
        // Auto-hide expired documents (Self-Destruct mechanism)
        const validDocs = data.filter(d => !d.expiryDate || new Date(d.expiryDate) > new Date());
        setDocs(validDocs);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load documents. Please ensure backend server is running on port 5000."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDocs();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteDoc(id, token);
      setDocs(docs.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete document.");
    }
  };

  const filteredDocs = useMemo(() => {
    return docs.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (doc.category && doc.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [docs, searchQuery]);

  const categorizedDocs = filteredDocs.reduce((acc, doc) => {
    const cat = doc.category || "Others";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(doc);
    return acc;
  }, {});

  const getCategoryIcon = (cat) => {
    switch (cat.toLowerCase()) {
      case 'health': return '🏥';
      case 'education': return '📚';
      case 'finance': return '💰';
      case 'personal': return '🧑';
      case 'work': return '💼';
      default: return '📁';
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container animate-fade-up">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <h2 style={{ margin: 0, fontSize: "2.5rem", letterSpacing: "-1px" }}>Secure Vault</h2>
          
          <div style={{ display: "flex", gap: "1rem", flex: "1 1 auto", maxWidth: "400px", justifyContent: "flex-end" }}>
            <input 
              type="text" 
              placeholder="🔍 Search documents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: "10px 16px", borderRadius: "20px", flex: 1, margin: 0 }}
            />
            {token && <button onClick={() => navigate("/upload")} style={{ padding: "10px 24px", borderRadius: "20px", whiteSpace: "nowrap" }}>+ New</button>}
          </div>
        </div>

        {loading && <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Loading your documents...</p>}
        {error && <p style={{ color: "var(--danger)", padding: "1rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px" }}>{error}</p>}

        {!token && (
          <div className="flex-center" style={{ minHeight: "200px" }}>
            <button onClick={() => navigate("/")} style={{ transform: "scale(1.1)" }}>Go to Login</button>
          </div>
        )}

        {!loading && !error && docs.length === 0 && (
          <div className="glass-panel" style={{ textAlign: "center", padding: "4rem 2rem", margin: "2rem 0" }}>
            <div style={{ fontSize: "4rem", opacity: 0.5, marginBottom: "1rem" }}>🗄️</div>
            <p style={{ color: "var(--text-muted)", fontSize: "1.3rem", marginBottom: "2rem" }}>Your vault is completely empty.</p>
            <button onClick={() => navigate("/upload")} style={{ padding: "12px 30px", fontSize: "1.1rem" }}>Upload your first document</button>
          </div>
        )}

        {!loading && !error && docs.length > 0 && filteredDocs.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "3rem" }}>No documents match your search "{searchQuery}"</p>
        )}

        {!loading && !error && filteredDocs.length > 0 && (
          <div>
            {Object.keys(categorizedDocs).sort().map(category => (
              <div key={category} className="glass-panel" style={{ marginBottom: "3rem", padding: "2rem", background: "rgba(255,255,255,0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "2rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1.2rem" }}>
                  <span style={{ fontSize: "2.2rem", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}>
                    {getCategoryIcon(category)}
                  </span>
                  <h3 style={{ fontSize: "1.8rem", margin: 0, color: "#fff", letterSpacing: "0.5px" }}>
                    {category}
                  </h3>
                  <span style={{ marginLeft: "auto", background: "rgba(82, 113, 255, 0.15)", border: "1px solid rgba(82, 113, 255, 0.3)", padding: "6px 14px", borderRadius: "20px", fontSize: "0.9rem", color: "var(--text-main)", fontWeight: "600" }}>
                    {categorizedDocs[category].length} {categorizedDocs[category].length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div className="doc-grid" style={{ marginTop: 0 }}>
                  {categorizedDocs[category].map((doc) => (
                    <DocumentCard key={doc._id} doc={doc} onDelete={handleDelete} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}