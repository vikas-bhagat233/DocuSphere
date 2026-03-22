import axios from "axios";

const API = "http://localhost:5000/api/documents";

export const getDocs = async (token) => {
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const uploadDoc = async (formData, token) => {
  const res = await axios.post(`${API}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
};

export const getDocById = async (id, token) => {
  const res = await axios.get(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getDocFile = async (id, token) => {
  const res = await axios.get(`${API}/${id}/file`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "arraybuffer"
  });

  const contentType = res.headers["content-type"] || "application/octet-stream";

  if (contentType.includes("application/json")) {
    const text = new TextDecoder().decode(res.data);
    const parsed = JSON.parse(text);

    return {
      mode: parsed.mode || "direct",
      url: parsed.url,
      message: parsed.message,
      upstreamStatus: parsed.upstreamStatus
    };
  }

  return {
    mode: "blob",
    blob: new Blob([res.data], { type: contentType }),
    contentType
  };
};

export const getPublicDocById = async (id, pin = "") => {
  const res = await axios.get(`${API}/public/${id}${pin ? `?pin=${pin}` : ''}`);
  return res.data;
};

export const getPublicDocFile = async (id, pin = "") => {
  const res = await axios.get(`${API}/public/${id}/file${pin ? `?pin=${pin}` : ''}`, {
    responseType: "arraybuffer"
  });

  const contentType = res.headers["content-type"] || "application/octet-stream";

  if (contentType.includes("application/json")) {
    const text = new TextDecoder().decode(res.data);
    const parsed = JSON.parse(text);

    return {
      mode: parsed.mode || "direct",
      url: parsed.url,
      message: parsed.message,
      upstreamStatus: parsed.upstreamStatus
    };
  }

  return {
    mode: "blob",
    blob: new Blob([res.data], { type: contentType }),
    contentType
  };
};

export const deleteDoc = async (id, token) => {
  await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const togglePublicStatus = async (id, token) => {
  const res = await axios.put(`${API}/${id}/public`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getPublicPortfolio = async (userId, pin = "") => {
  const res = await axios.get(`${API}/portfolio/${userId}${pin ? `?pin=${pin}` : ''}`);
  return res.data;
};

export const getDeletedDocs = async (token) => {
  const res = await axios.get(`${API}/trash/deleted`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const restoreDoc = async (id, token) => {
  const res = await axios.put(`${API}/${id}/restore`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const permanentlyDeleteDoc = async (id, token) => {
  const res = await axios.delete(`${API}/${id}/permanent`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const uploadNewVersion = async (id, formData, token) => {
  const res = await axios.put(`${API}/${id}/file`, formData, {
    headers: { 
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}` 
    }
  });
  return res.data;
};