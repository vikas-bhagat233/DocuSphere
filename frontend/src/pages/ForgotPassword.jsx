import { useState } from "react";
import { getSecurityQuestion, resetPassword } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGetQuestion = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setError("");
    try {
      const data = await getSecurityQuestion(email);
      setQuestion(data.securityQuestion);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Could not find account.");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!answer || !newPassword) {
      setError("Please fill out all fields.");
      return;
    }
    setError("");
    try {
      await resetPassword({ email, securityAnswer: answer, newPassword });
      alert("Password successfully reset! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container animate-fade-up flex-center" style={{ minHeight: "calc(100vh - 80px)" }}>
        <div className="glass-panel" style={{ width: "100%", maxWidth: "400px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Account Recovery</h2>
          
          {error && <p style={{ color: "var(--danger)", marginBottom: "1.5rem", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "8px", textAlign: "center" }}>{error}</p>}

          {step === 1 && (
            <form onSubmit={handleGetQuestion} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", marginBottom: "1rem" }}>
                Enter your account email to retrieve your security question.
              </p>
              <input 
                type="email" 
                placeholder="Account Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <button type="submit" style={{ marginTop: "1rem" }}>Find Account</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "rgba(0,0,0,0.2)", padding: "15px", borderRadius: "8px", marginBottom: "0.5rem" }}>
                <p style={{ color: "var(--accent-light)", fontSize: "0.85rem", margin: "0 0 5px 0" }}>Security Question:</p>
                <p style={{ color: "#fff", fontWeight: "500", margin: 0 }}>{question}</p>
              </div>
              
              <input 
                type="text" 
                placeholder="Your Secret Answer" 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)} 
                required 
              />
              <input 
                type="password" 
                placeholder="New Password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                style={{ marginTop: "0.5rem" }}
              />
              <button type="submit" style={{ marginTop: "1rem", background: "var(--accent-dark)" }}>Reset Password</button>
            </form>
          )}

          <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Remembered? <Link to="/login" style={{ color: "var(--accent-light)", textDecoration: "none" }}>Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
