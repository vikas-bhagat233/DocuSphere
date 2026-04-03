import { useContext, useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login: setAuthLogin } = useContext(AuthContext);

  const handleLogin = async () => {
    setError("");

    if (!data.email || !data.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const res = await login(data);
      setAuthLogin(res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex-center" style={{ background: "radial-gradient(circle at center, var(--bg-secondary) 0%, var(--bg-primary) 100%)" }}>
      <div className="glass-panel auth-card" style={{ padding: "3.5rem 2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>DocuSphere</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: "500" }}>Login to your secure vault</p>
        </div>
        
        <div style={{ marginBottom: "1.5rem" }}>
          <label>Vault Identity (Email)</label>
          <input 
            type="email" 
            placeholder="e.g. vikas@docu.sphere" 
            onChange={(e)=>setData({...data,email:e.target.value})}
            style={{ marginTop: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label>Access Key (Password)</label>
          <input 
            placeholder="••••••••" 
            type="password" 
            onChange={(e)=>setData({...data,password:e.target.value})}
            style={{ marginTop: "10px" }}
          />
        </div>

        {error && <div style={{ color: "var(--danger)", marginBottom: "1.5rem", fontSize: "0.85rem", background: "rgba(244, 63, 94, 0.1)", padding: "10px", borderRadius: "8px", borderLeft: "4px solid var(--danger)" }}>{error}</div>}
        
        <button style={{ width: "100%", padding: "14px", fontSize: "1rem", marginBottom: "1rem" }} onClick={handleLogin}>
          Authorize Entry
        </button>
        
        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
            <button 
              style={{ flex: 1, background: "transparent", border: "1px solid var(--glass-border)", fontSize: "0.85rem", padding: "10px" }} 
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
            <button 
              style={{ flex: 1, background: "transparent", border: "1px solid var(--glass-border)", fontSize: "0.85rem", padding: "10px" }} 
              onClick={() => navigate('/forgot-password')}
            >
              Recover
            </button>
        </div>

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.8rem", color: "var(--text-muted)", opacity: 0.6 }}>
          Standard Encryption: AES-256 Enabled
        </p>
      </div>
    </div>
  );
}