const FALLBACK_REMOTE_BASE_URL = "https://docusphere-9xl0.onrender.com";

const isLocalHost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (isLocalHost ? "http://localhost:5000" : FALLBACK_REMOTE_BASE_URL);
