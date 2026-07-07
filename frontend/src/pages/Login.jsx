import { useContext, useEffect, useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login: setAuthLogin } = useContext(AuthContext);

  useEffect(() => {
    document.title = "DocuSphere | Secure document portfolios";
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        "content",
        "Create a secure DocuSphere document portfolio, share selected files, and keep private documents in one protected vault."
      );
    }
  }, []);

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
    <main className="home-page">
      <section className="home-hero" aria-labelledby="homepage-heading">
        <div className="home-copy">
          <p className="home-eyebrow">Secure document portfolio</p>
          <h1 id="homepage-heading">Create one trusted place to share your documents.</h1>
          <p className="home-subheadline">
            DocuSphere gives you a private vault for every file and a public portfolio for only the documents you choose to show.
          </p>

          <div className="home-actions">
            <button className="home-primary-cta" onClick={() => navigate("/signup")}>
              Create my document portfolio
            </button>
            <button className="home-secondary-cta" onClick={() => document.getElementById("login-email")?.focus()}>
              Sign in
            </button>
          </div>

          <ul className="home-proof-list" aria-label="DocuSphere account benefits">
            <li>Upload PDFs, resumes, certificates, and work samples into a protected vault.</li>
            <li>Choose what appears on your portfolio before you share the link.</li>
            <li>Keep private files private while still giving people a polished document view.</li>
          </ul>
        </div>

        <aside className="sample-portfolio" aria-label="Sample shared document portfolio">
          <div className="sample-profile">
            <div className="sample-avatar" aria-hidden="true">AR</div>
            <div>
              <p className="sample-label">Shared portfolio preview</p>
              <h2>Avery Rao</h2>
              <p>Admissions packet for spring review</p>
            </div>
          </div>
          <div className="sample-documents">
            <article>
              <span>Visible</span>
              <strong>Scholarship essay.pdf</strong>
              <small>Shared for reviewer comments</small>
            </article>
            <article>
              <span>Visible</span>
              <strong>Transcript summary.pdf</strong>
              <small>Clean copy, ready to send</small>
            </article>
            <article className="private-document">
              <span>Private</span>
              <strong>Financial aid notes.docx</strong>
              <small>Stored in vault, hidden from portfolio</small>
            </article>
          </div>
          <div className="sample-share-row">
            <code>docusphere.netlify.app/u/avery</code>
            <span>Selected documents only</span>
          </div>
        </aside>
      </section>

      <section className="home-auth-section" aria-label="Sign in to DocuSphere">
        <div className="glass-panel auth-card home-auth-card">
          <div className="auth-heading">
            <h2>Open your vault</h2>
            <p>Sign in to manage documents, portfolio visibility, and sharing links.</p>
          </div>

          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              onChange={(e)=>setData({...data,email:e.target.value})}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              onChange={(e)=>setData({...data,password:e.target.value})}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" onClick={handleLogin}>
            Open my portfolio vault
          </button>

          <div className="auth-links">
            <button onClick={() => navigate('/signup')}>
              Create portfolio
            </button>
            <button onClick={() => navigate('/forgot-password')}>
              Recover access
            </button>
          </div>

          <p className="auth-note">
            AES-256 vault protection for stored documents
          </p>
        </div>
      </section>

      <footer className="site-footer">
        <span>© 2026 DocuSphere</span>
        <a href="https://tin.computer" target="_blank" rel="noreferrer">
          <span className="tin-mark" aria-hidden="true" />
          Growth by Tin
        </a>
      </footer>
    </main>
  );
}
