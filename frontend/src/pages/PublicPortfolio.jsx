import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicPortfolio, getPublicDocFile } from "../services/documentService";
import Navbar from "../components/Navbar";

export default function PublicPortfolio() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isPinRequired, setIsPinRequired] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [opening, setOpening] = useState(null);
  
  const navigate = useNavigate();

  const loadPortfolio = async (pin = "") => {
    try {
      const result = await getPublicPortfolio(userId, pin);
      setData(result);
      setError("");
      setIsPinRequired(false);
    } catch (err) {
      if (err.response?.status === 401 && err.response?.data?.isPinRequired) {
        setIsPinRequired(true);
        setError("");
      } else {
        setError(err.response?.data?.message || "Unable to load portfolio or it does not exist.");
      }
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, [userId]);

  const handlePinSubmit = () => {
    if (!pinInput || pinInput.length !== 4) {
      setError("Please enter a valid 4-digit PIN.");
      return;
    }
    loadPortfolio(pinInput);
  };

  const handleOpenFile = async (docId, docTitle) => {
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`Loading ${docTitle}...`);
    }

    try {
      setOpening(docId);
      const result = await getPublicDocFile(docId, pinInput); 
      // The individual document might also have an individual PIN! If it does, we'd theoretically need it,
      // but if it's on the portfolio, we'll try to just load it. If we need to pass the doc PIN, we can't easily without a prompt.
      // But typically, docs on the public portfolio shouldn't be individually locked, or the user shouldn't put a PIN on them.
      
      if (result.mode === "direct") {
        if (!result.url) {
          alert(result.message || "Unable to open file.");
          if (newWindow) newWindow.close();
          return;
        }
        if (newWindow) newWindow.location.href = result.url;
        else window.location.href = result.url;
        return;
      }

      const blobUrl = window.URL.createObjectURL(result.blob);
      if (newWindow) newWindow.location.href = blobUrl;
      else window.location.href = blobUrl;
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to open file.");
      if (newWindow) newWindow.close();
    } finally {
      setOpening(null);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container animate-fade-up" style={{ minHeight: "calc(100vh - 80px)", paddingTop: "2rem" }}>
        
        {error && <div style={{ color: "var(--danger)", marginBottom: "1.5rem", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "8px", textAlign: "center" }}>{error}</div>}

        {isPinRequired && !data && (
          <div className="glass-panel" style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center", padding: "3rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
            <h2 style={{ marginBottom: "1rem" }}>Protected Portfolio</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>This Public Portfolio requires an access pin.</p>
            <input 
              type="password" 
              maxLength="4"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="0000"
              style={{ width: "150px", textAlign: "center", fontSize: "1.5rem", letterSpacing: "8px", marginBottom: "1rem" }}
            />
            <button onClick={handlePinSubmit} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #10b981, #059669)" }}>
              Access Portfolio
            </button>
          </div>
        )}

        {data && !isPinRequired && (
          <>
            <div style={{ textAlign: "center", marginBottom: "3rem", maxWidth: "800px", margin: "0 auto 3rem" }}>
              <div 
                style={{ 
                  width: "120px", 
                  height: "120px", 
                  borderRadius: "50%", 
                  background: "linear-gradient(135deg, var(--accent-light), var(--accent-dark))", 
                  color: "#fff", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "3.5rem", 
                  margin: "0 auto 1.5rem", 
                  fontWeight: "bold",
                  border: "4px solid rgba(255,255,255,0.1)",
                  overflow: "hidden"
                }}
              >
                {data.user.profilePic ? (
                  <img src={data.user.profilePic} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  data.user.name.charAt(0).toUpperCase()
                )}
              </div>
              <h1 style={{ fontSize: "2.8rem", marginBottom: "0.5rem", textTransform: "capitalize" }}>{data.user.name}</h1>
              {data.user.bio && (
                <p style={{ 
                  color: "var(--text-main)", 
                  fontSize: "1.05rem", 
                  lineHeight: "1.6", 
                  maxWidth: "500px", 
                  margin: "0 auto 1rem",
                  opacity: 0.9 
                }}>
                  {data.user.bio}
                </p>
              )}
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                {data.documents.length} Verified Documents Ready
              </p>
            </div>

            {data.documents.length === 0 ? (
              <div className="glass-panel" style={{ textAlign: "center", padding: "3rem" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>This user hasn't made any documents public yet.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                {data.documents.map(doc => (
                  <div key={doc._id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.3)" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                      {doc.fileUrl?.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? '🖼️' : '📄'}
                    </div>
                    <p style={{ margin: "0 0 0.5rem 0", background: "rgba(82, 113, 255, 0.15)", padding: "4px 10px", borderRadius: "12px", color: "var(--accent-light)", fontSize: "0.75rem", fontWeight: "600", alignSelf: "flex-start", textTransform: "uppercase" }}>
                      {doc.category || "General"}
                    </p>
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", lineHeight: "1.3" }}>{doc.title}</h3>
                    <div style={{ flexGrow: 1 }}></div>
                    <button 
                      onClick={() => handleOpenFile(doc._id, doc.title)} 
                      disabled={opening === doc._id}
                      style={{ width: "100%", padding: "10px", marginTop: "1rem" }}
                    >
                      {opening === doc._id ? "Opening..." : "View Document"}
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ textAlign: "center", marginTop: "4rem" }}>
               <button onClick={() => navigate("/")} style={{ background: "transparent", color: "var(--text-muted)", border: "none", textDecoration: "underline" }}>
                 Powered by DocuSphere
               </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
