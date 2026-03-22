import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div>
      <h2>DocuSphere</h2>
      <Link to="/dashboard">Dashboard</Link><br />
      <Link to="/upload">Upload</Link><br />
      <Link to="/documents">Documents</Link>
    </div>
  );
}