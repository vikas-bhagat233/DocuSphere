import { useState, useRef } from "react";
import { uploadDoc } from "../services/documentService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [pin, setPin] = useState("");
  const [tags, setTags] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      if (!title) setTitle(e.dataTransfer.files[0].name.split('.')[0]); 
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      if (!title) setTitle(e.target.files[0].name.split('.')[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select or drop a file first.");
      return;
    }
    if (!title) {
      alert("Please enter a document name.");
      return;
    }
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("category", category || "Others");
      if (expiryDate) formData.append("expiryDate", expiryDate);
      if (pin) formData.append("pin", pin);
      if (tags) formData.append("tags", tags);
      if (reminderDate) formData.append("reminderDate", reminderDate);

      await uploadDoc(formData, token);
      alert("Uploaded & Secured Successfully");
      navigate("/documents"); 
    } catch (error) {
      alert("Upload failed: " + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container animate-fade-up flex-center" style={{ minHeight: "calc(100vh - 80px)" }}>
        <div className="glass-panel" style={{ width: "100%", maxWidth: "600px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Secure Vault Upload</h2>
          
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            style={{
              padding: "2.5rem 1.5rem",
              border: `2px dashed ${isDragging ? 'var(--accent-light)' : 'var(--glass-border)'}`,
              borderRadius: "12px",
              background: isDragging ? 'rgba(82, 113, 255, 0.1)' : 'rgba(0,0,0,0.2)',
              textAlign: "center",
              cursor: "pointer",
              marginBottom: "1.5rem",
              transition: "all 0.3s ease"
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem", opacity: file ? 1 : 0.5 }}>
              {file ? '✅' : '📥'}
            </div>
            <p style={{ color: "var(--text-main)", margin: 0, fontWeight: "500", fontSize: "1.1rem" }}>
              {file ? file.name : "Click to browse or drag file here"}
            </p>
            {!file && <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>Auto-OCR & AI Processing enabled.</p>}
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Document Name</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Required" required />
            </div>
            <div>
              <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="General">General</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
          
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
              <span>Smart Tags</span>
              <span style={{ fontSize: "0.7rem", background: "rgba(82, 113, 255, 0.2)", padding: "2px 6px", borderRadius: "10px", color: "var(--accent-light)" }}>Optional</span>
            </label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. taxes, 2026, urgent (comma separated)" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
            <div>
              <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>4-Digit Secure PIN</label>
              <input type="password" maxLength="4" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="0000" />
            </div>
            <div>
              <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Alert Reminder</label>
              <input type="date" value={reminderDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setReminderDate(e.target.value)} style={{ padding: "12px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", borderRadius: "8px", color: "#fff", width: "100%", fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Self-Destruct On</label>
              <input type="date" value={expiryDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setExpiryDate(e.target.value)} style={{ padding: "12px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)", borderRadius: "8px", color: "#fff", width: "100%", fontFamily: "inherit" }} />
            </div>
          </div>
          
          <button style={{ width: "100%" }} onClick={handleUpload} disabled={uploading}>
            {uploading ? "AI Processing & Uploading..." : "Upload & Analyze"}
          </button>
        </div>
      </div>
    </div>
  );
}