import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { togglePublicStatus, uploadNewVersion } from "../services/documentService";

export default function DocumentCard({ doc, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [isPublic, setIsPublic] = useState(doc.isPublic || false);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const handleShare = () => {
    const finalLink = `${window.location.origin}/doc/${doc._id}`;
    navigator.clipboard.writeText(finalLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTogglePublic = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await togglePublicStatus(doc._id, token);
      setIsPublic(res.isPublic);
    } catch (err) {
      alert("Failed to update public status.");
    }
  };

  const handleUpdateVersion = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      await uploadNewVersion(doc._id, formData, token);
      alert("Successfully updated to a new version! The Share Link remains exactly the same.");
      window.location.reload();
    } catch (err) {
      alert("Failed to update document version.");
    } finally {
      setIsUpdating(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isImage = doc.fileUrl && doc.fileUrl.toLowerCase().match(/\.(jpeg|jpg|png|gif|webp)$/);

  const getFileIcon = (url) => {
    if (!url) return '📄';
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.endsWith('.pdf')) return '📕';
    if (lowerUrl.match(/\.(doc|docx)$/)) return '📘';
    if (lowerUrl.match(/\.(xls|xlsx|csv)$/)) return '📗';
    if (lowerUrl.match(/\.(zip|rar|7z)$/)) return '📦';
    return '📄';
  };

  return (
    <div className="doc-card" style={{ display: "flex", flexDirection: "column", minHeight: "240px", position: "relative" }}>
      {doc.pin && (
        <div style={{ position: "absolute", top: "-10px", left: "-10px", background: "var(--danger)", color: "#fff", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", zIndex: 10 }}>
          🔒
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isImage ? "0.5rem" : "1rem" }}>
        
        {!isImage && <div style={{ fontSize: "2.5rem", opacity: 0.9, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}>{getFileIcon(doc.fileUrl)}</div>}
        {isImage && <div style={{ fontSize: "1.5rem" }}>🖼️</div>}

        <p style={{ margin: 0, background: "rgba(82, 113, 255, 0.15)", padding: "4px 10px", borderRadius: "12px", color: "var(--accent-light)", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {doc.category || "General"}
        </p>
      </div>

      {isImage && (
        <div style={{ width: "100%", height: "120px", marginBottom: "1rem", borderRadius: "8px", overflow: "hidden", background: "rgba(0,0,0,0.2)" }}>
          <img src={doc.fileUrl} alt={doc.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}

      <h3 style={{ textTransform: "capitalize", fontSize: "1.3rem", lineHeight: "1.3", marginBottom: "0.2rem", wordBreak: "break-word", display: "flex", alignItems: "center", gap: "8px" }}>
        {doc.title}
        {isPublic && <span style={{ fontSize: "1rem" }} title="Publicly accessible on your Portfolio">🌟</span>}
      </h3>
      
      <p style={{ margin: "0 0 0.5rem 0", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "500" }}>
        👁️ Views: {doc.views || 0} {doc.lastViewedAt ? `| Last: ${new Date(doc.lastViewedAt).toLocaleDateString()}` : ''} 
        {doc.version > 1 ? ` | v${doc.version}` : ''}
      </p>
      
      {doc.tags && doc.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "0.5rem" }}>
          {doc.tags.map(t => (
            <span key={t} style={{ fontSize: "0.7rem", background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "10px", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.05)" }}>#{t}</span>
          ))}
        </div>
      )}

      <div style={{ flexGrow: 1, marginBottom: "1rem" }}>
        {doc.createdAt && (
          <p style={{ fontSize: "0.80rem", color: "var(--text-muted)", margin: 0 }}>
            Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
          </p>
        )}
        {doc.pin && (
          <div style={{ marginTop: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Secure PIN: </span>
            <span style={{ fontSize: "0.85rem", background: "rgba(239, 68, 68, 0.15)", color: "var(--danger)", padding: "2px 8px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", filter: showAi ? "none" : "blur(4px)", transition: "all 0.3s" }} onClick={() => setShowAi(!showAi)} title="Click to Reveal">
              {doc.pin}
            </span>
          </div>
        )}
      </div>

      {doc.aiSummary && (
        <div style={{ marginBottom: "1rem", background: showAi ? "rgba(16, 185, 129, 0.1)" : "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", borderRadius: "8px", overflow: "hidden", transition: "all 0.3s ease" }}>
          <button onClick={() => setShowAi(!showAi)} style={{ width: "100%", background: "transparent", color: showAi ? "#10b981" : "var(--text-main)", fontSize: "0.85rem", padding: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>✨ AI Analysis</span>
            <span>{showAi ? "▼" : "▶"}</span>
          </button>
          {showAi && (
            <div style={{ padding: "10px", fontSize: "0.8rem", color: "var(--text-muted)", borderTop: "1px solid var(--glass-border)", lineHeight: "1.5" }}>
              {doc.aiSummary}
            </div>
          )}
        </div>
      )}

      <div className="card-actions" style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "1rem", display: "flex", flexWrap: "wrap", gap: "8px" }}>
        <Link to={`/doc/${doc._id}`} style={{ flex: "1" }}>
          <button style={{ width: "100%", padding: "8px 12px", fontSize: "0.85rem", whiteSpace: "nowrap" }}>View</button>
        </Link>
        <button 
          onClick={handleShare} 
          style={{ flex: "1", padding: "8px 12px", fontSize: "0.85rem", background: copied ? "#10b981" : "transparent", border: "1px solid var(--glass-border)", color: copied ? "#fff" : "var(--text-main)", whiteSpace: "nowrap" }}
        >
          {copied ? "Copied!" : "Share"}
        </button>
        <button 
          onClick={handleTogglePublic} 
          style={{ flex: "1", padding: "8px 12px", fontSize: "0.85rem", background: isPublic ? "#10b981" : "transparent", color: isPublic ? "#fff" : "var(--text-main)", border: "1px solid var(--glass-border)", whiteSpace: "nowrap" }}
        >
          {isPublic ? "🌟 Top Pick" : "Make Public"}
        </button>
        
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUpdateVersion} />
        
        <button 
          onClick={() => fileInputRef.current?.click()} 
          disabled={isUpdating}
          style={{ flex: "1", padding: "8px 12px", fontSize: "0.85rem", background: "transparent", color: "var(--text-main)", border: "1px solid var(--accent-light)", whiteSpace: "nowrap" }}
        >
          {isUpdating ? "..." : "🔄 Update File"}
        </button>

        <button className="danger-btn" onClick={() => onDelete(doc._id)} style={{ flex: "1", padding: "8px 12px", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
          Delete
        </button>
      </div>
    </div>
  );
}