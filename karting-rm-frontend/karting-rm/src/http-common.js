import axios from "axios";

// URL base tomada desde variables de entorno
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // usa .env
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;