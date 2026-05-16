import axios from "axios";

// 1. Configuração da URL Base com a nova versão v1
const api = axios.create({
  baseURL: "baseURL: import.meta.env.VITE_API_URL", // Adicionado /v1
  withCredentials: true, // Importante para o CSRF e Cookies que você já usa
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Rotas de Candidato (External) ---
export const getMyProfile = () => api.get("/candidates-external/me");
export const createCandidate = (data: any) =>
  api.post("/candidates-external", data);
export const updateCandidate = (id: string, data: any) =>
  api.put(`/candidates-external/${id}`, data);

// --- Rotas de Vagas (Público) ---
export const getOpenJobs = () => api.get("/jobs-available/open");

// --- Rotas de Auth ---
export const login = (credentials: any) => api.post("/auth/login", credentials);
export const getCsrfToken = () => api.get("/csrf-token");

// --- Rotas de RH (Internal) ---
export const getAllCandidates = () => api.get("/candidates-internal");

export default api;
