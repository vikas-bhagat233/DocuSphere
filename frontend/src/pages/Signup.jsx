import { useState } from "react";
import { signup } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("What is your mother's maiden name?");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!securityAnswer) {
      alert("Please provide a security answer.");
      return;
    }
    try {
      const data = await signup({ name, email, password, securityQuestion, securityAnswer });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: "100vh", background: "radial-gradient(circle at top left, var(--bg-secondary) 0%, var(--bg-primary) 100%)", padding: "2rem" }}>
      <div className="glass-panel auth-card" style={{ maxWidth: "480px", padding: "3rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Initialize <span style={{ color: "var(--accent-light)" }}>Vault</span></h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: "500" }}>Create your secure encrypted workspace</p>
        </div>

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
            <div>
              <label>Full Identity Name</label>
              <input 
                type="text" 
                placeholder="Vikas..." 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label>Vault Email</label>
              <input 
                type="email" 
                placeholder="name@domain.com" 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label>Master Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <div style={{ marginTop: "1rem", borderTop: "1px solid var(--glass-border)", paddingTop: "1.5rem" }}>
            <label style={{ color: "var(--accent-light)", fontSize: "0.75rem", marginBottom: "1rem", display: "block", letterSpacing: "1px" }}>🔐 BACKUP RECOVERY KEY</label>
            
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.8rem" }}>Security Challenge</label>
              <select 
                value={securityQuestion} 
                onChange={(e) => setSecurityQuestion(e.target.value)}
                style={{ marginTop: "8px" }}
              >
                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                <option value="In what city were you born?">In what city were you born?</option>
                <option value="What high school did you attend?">What high school did you attend?</option>
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: "0.8rem" }}>Secret Answer</label>
              <input 
                type="text" 
                placeholder="Enter answer..." 
                onChange={(e) => setSecurityAnswer(e.target.value)} 
                required 
                style={{ marginTop: "8px" }}
              />
            </div>
          </div>

          <button type="submit" style={{ marginTop: "1.5rem", padding: "16px" }}>Complete Initialization</button>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Joined before? <Link to="/login" style={{ color: "var(--accent-light)", fontWeight: "600" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}