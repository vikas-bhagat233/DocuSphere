import axios from "axios";

const API = "https://docusphere-9xl0.onrender.com/api/auth";

export const login = async (userData) => {
  const res = await axios.post(`${API}/login`, userData);
  return res.data;
};

export const signup = async (userData) => {
  const res = await axios.post(`${API}/signup`, userData);
  return res.data;
};

export const getSecurityQuestion = async (email) => {
  const res = await axios.post(`${API}/get-security-question`, { email });
  return res.data;
};

export const resetPassword = async (data) => {
  const res = await axios.post(`${API}/reset-password`, data);
  return res.data;
};

export const updateProfilePin = async (pin, token) => {
  const res = await axios.put(`${API}/profile-pin`, { pin }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getProfile = async (token) => {
  const res = await axios.get(`${API}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateProfile = async (formData, token) => {
  const res = await axios.put(`${API}/profile`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data" 
    }
  });
  return res.data;
};