import axios from "axios";

// Using the exact Render backend URL configuration from the documentService setup
const API = "https://docusphere-9xl0.onrender.com/api/ai";

export const chatWithBot = async (prompt, token) => {
  const res = await axios.post(`${API}/chat`, { prompt }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.reply;
};
