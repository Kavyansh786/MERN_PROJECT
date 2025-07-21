import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Change if your backend runs elsewhere
  withCredentials: true, // If you use cookies/auth
});

export default api; 