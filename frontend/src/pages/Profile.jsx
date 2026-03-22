import { useState, useEffect, useRef } from "react";
import { getProfile, updateProfile } from "../services/authService";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile(token);
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setBio(data.bio || "");
        setPreview(data.profilePic || "");
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("bio", bio);
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const updated = await updateProfile(formData, token);
      alert("Profile updated successfully!");
      setUser(updated);
    } catch (err) {
      alert("Failed to update profile: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div><Navbar /><div className="container">Loading Profile...</div></div>;

  return (
    <div>
      <Navbar />
      <div className="container animate-fade-up flex-center" style={{ minHeight: "calc(100vh - 80px)" }}>
        <div className="glass-panel" style={{ width: "100%", maxWidth: "600px", padding: "3rem" }}>
          <h2 style={{ textAlign: "center", marginBottom: "2.5rem" }}>Your Professional Identity</h2>
          
          <div style={{ textAlign: "center", marginBottom: "2.5rem", position: "relative" }}>
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "rgba(0,0,0,0.3)",
                border: "2px solid var(--accent-light)",
                margin: "0 auto",
                overflow: "hidden",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#fff"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--accent-light)"}
            >
              {preview ? (
                <img src={preview} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "3rem" }}>👤</span>
              )}
              <div style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                fontSize: "0.7rem",
                padding: "4px 0",
                opacity: 0.8
              }}>
                Edit
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept="image/*" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem", display: "block" }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
            </div>
            
            <div>
              <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem", display: "block" }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            </div>

            <div>
              <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem", display: "block" }}>Professional Bio</label>
              <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                placeholder="Tell companies about yourself..."
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "12px 16px",
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "8px",
                  color: "var(--text-main)",
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none"
                }}
              />
            </div>

            <button 
              onClick={handleUpdate} 
              disabled={saving}
              style={{ width: "100%", marginTop: "1rem" }}
            >
              {saving ? "Saving Changes..." : "Update Identity"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
