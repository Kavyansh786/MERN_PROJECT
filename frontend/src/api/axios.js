import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
  withCredentials: false, // set to true if using cookies/session
});

export default instance;
