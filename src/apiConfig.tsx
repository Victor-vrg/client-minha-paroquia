import axios from "axios";

const api = axios.create({
    baseURL: 'https://server-minha-paroquia.onrender.com',
  });
export default api;