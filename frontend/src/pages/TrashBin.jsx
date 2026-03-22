import { useEffect, useState } from "react";
import { getDeletedDocs, restoreDoc, permanentlyDeleteDoc } from "../services/documentService";
import Navbar from "../components/Navbar";

export default function TrashBin() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const loadDocs = async () => {
    try {
      if (token) {
        const data = await getDeletedDocs(token);
        setDocs(data);
      }
    } catch (err) {
      console.error("Failed to load deleted docs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, [token]);

  const handleRestore = async (id) => {
    if (!window.confirm("Restore this document to your main vault?")) return;
    try {
      await restoreDoc(id, token);
      setDocs(docs.filter(d => d._id !== id));
    } catch (err) {
      alert("Failed to restore document");
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("WARNING: This will permanently vaporize this document. It cannot be recovered. Are you sure?")) return;
    try {
      await permanentlyDeleteDoc(id, token);
      setDocs(docs.filter(d => d._id !== id));
    } catch (err) {
      alert("Failed to delete document");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container animate-fade-up">
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>🗑️</span> Recycle Bin
        </h2>
        
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem", padding: "1rem", background: "rgba(239, 68, 68, 0.05)", borderLeft: "4px solid var(--danger)", borderRadius: "0 8px 8px 0" }}>
          Documents here will be permanently incinerated 30 days after deletion.
        </p>

        {loading ? (
          <p>Scanning deleted files...</p>
        ) : docs.length === 0 ? (
          <div className="glass-panel flex-center" style={{ minHeight: "300px", flexDirection: "column" }}>
            <span style={{ fontSize: "4rem", opacity: 0.5, marginBottom: "1rem" }}>🍃</span>
            <p style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}>Recycle Bin is empty.</p>
          </div>
        ) : (
          <div className="doc-grid">
            {docs.map(doc => (
              <div key={doc._id} className="doc-card" style={{ display: "flex", flexDirection: "column", minHeight: "180px", opacity: 0.8, filter: "grayscale(100%)", transition: "all 0.3s" }} onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.filter = "grayscale(0%)"; }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.filter = "grayscale(100%)"; }}>
                
                <h3 style={{ textTransform: "capitalize", fontSize: "1.2rem", marginBottom: "0.2rem", wordBreak: "break-word" }}>
                  {doc.title}
                </h3>
                <p style={{ color: "var(--danger)", fontSize: "0.8rem", fontWeight: "600", marginBottom: "1rem" }}>
                  Deleted: {new Date(doc.deletedAt).toLocaleDateString()}
                </p>

                <div style={{ flexGrow: 1 }}></div>

                <div className="card-actions" style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "1rem", display: "flex", gap: "8px" }}>
                  <button onClick={() => handleRestore(doc._id)} style={{ flex: "1", padding: "8px", fontSize: "0.85rem", background: "transparent", color: "#10b981", border: "1px solid #10b981", whiteSpace: "nowrap" }}>
                    🔄 Restore
                  </button>
                  <button className="danger-btn" onClick={() => handlePermanentDelete(doc._id)} style={{ flex: "1", padding: "8px", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                    🔥 Burn
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
