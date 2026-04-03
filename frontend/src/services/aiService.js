import axios from "axios";
import { API_BASE_URL } from "./apiBase";

const API = `${API_BASE_URL}/api/ai`;

export const chatWithBot = async (prompt, token) => {
  const res = await axios.post(`${API}/chat`, { prompt }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.reply;
};
