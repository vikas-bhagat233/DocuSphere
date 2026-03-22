import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicDocById, getPublicDocFile, getDocById, getDocFile } from "../services/documentService";
import Navbar from "../components/Navbar";

export default function SharedView() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState("");
  const [opening, setOpening] = useState(false);
  
  // PIN & Master Key Logic
  const [isPinRequired, setIsPinRequired] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const token = localStorage.getItem("token");
  
  const navigate = useNavigate();

  const loadDocument = async (pin = "") => {
    try {
      let result;
      
      // Attempt Master Key Bypass (Owner Check)
      if (token && !pinInput) {
        try {
          result = await getDocById(id, token);
        } catch (ownerErr) {
          // Fallback to public fetch if not owner
          result = await getPublicDocById(id, pin);
        }
      } else {
        // Enforce PIN wall for unauthenticated guests
        result = await getPublicDocById(id, pin);
      }

      setDoc(result);
      setError("");
      setIsPinRequired(false);
    } catch (err) {
      if (err.response?.status === 401 && err.response?.data?.isPinRequired) {
        setIsPinRequired(true);
        setError("");
      } else {
        setError(err.response?.data?.message || "Unable to load document or document does not exist.");
      }
    }
  };

  useEffect(() => {
    loadDocument();
  }, [id, token]);

  const handleOpenFile = async () => {
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write("Loading shared document...");
    }

    try {
      setError("");
      setOpening(true);
      let result;

      // Master Key Bypass for Document File
      if (token && !pinInput && !isPinRequired) {
        try {
          result = await getDocFile(id, token);
        } catch (ownerErr) {
          result = await getPublicDocFile(id, pinInput);
        }
      } else {
        result = await getPublicDocFile(id, pinInput);
      }

      if (result.mode === "direct") {
        if (!result.url) {
          setError(result.message || "Unable to open file.");
          if (newWindow) newWindow.close();
          return;
        }

        if (newWindow) {
          newWindow.location.href = result.url;
        } else {
          window.location.href = result.url;
        }
        return;
      }

      const blobUrl = window.URL.createObjectURL(result.blob);
      if (newWindow) {
        newWindow.location.href = blobUrl;
      } else {
        window.location.href = blobUrl;
      }
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to open file.");
      if (newWindow) newWindow.close();
    } finally {
      setOpening(false);
    }
  };

  const handlePinSubmit = () => {
    if (!pinInput || pinInput.length !== 4) {
      setError("Please enter a valid 4-digit PIN.");
      return;
    }
    loadDocument(pinInput);
  };

  return (
    <div>
      <Navbar />
      <div className="container animate-fade-up flex-center" style={{ minHeight: "calc(100vh - 80px)" }}>
        <div className="glass-panel" style={{ width: "100%", maxWidth: "500px", textAlign: "center" }}>
          <h2 style={{ marginBottom: "2rem" }}>Secure Shared Document</h2>
          
          {error && <p style={{ color: "var(--danger)", marginBottom: "1.5rem", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "8px" }}>{error}</p>}

          {isPinRequired && !doc && (
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
              <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>This document is protected. Please enter the 4-digit Secure PIN to decrypt and unlock.</p>
              <input 
                type="password" 
                maxLength="4"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="0000"
                style={{ width: "150px", textAlign: "center", fontSize: "1.5rem", letterSpacing: "8px", marginBottom: "1rem" }}
              />
              <button onClick={handlePinSubmit} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #10b981, #059669)" }}>
                Unlock Vault
              </button>
            </div>
          )}

          {doc && !isPinRequired && (
            <div>
              <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "12px", padding: "2rem", marginBottom: "2rem" }}>
                <h3 style={{ textTransform: "capitalize", fontSize: "1.8rem", marginBottom: "0.5rem" }}>{doc.title}</h3>
                <p style={{ display: "inline-block", background: "rgba(82, 113, 255, 0.2)", padding: "4px 12px", borderRadius: "12px", color: "var(--accent-light)", fontSize: "0.9rem" }}>
                  {doc.category}
                </p>
                <p style={{ marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.9rem", fontStyle: "italic" }}>
                  This document has been securely shared with you via DocuSphere.
                </p>
                {token && (
                  <p style={{ marginTop: "1rem", color: "#10b981", fontSize: "0.85rem", fontWeight: "600" }}>
                    ✓ Owner Master Key Active
                  </p>
                )}
              </div>
              <button onClick={handleOpenFile} disabled={opening} style={{ width: "100%", padding: "16px", fontSize: "1.1rem" }}>
                {opening ? "Decrypting & Opening..." : "View Document File"}
              </button>
            </div>
          )}
          
          <button 
            onClick={() => navigate("/")}
            style={{ width: "100%", marginTop: "1rem", background: "transparent", border: "1px solid var(--glass-border)" }}
          >
            Create Your Own Free Vault
          </button>
        </div>
      </div>
    </div>
  );
}