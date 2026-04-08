import axios from "axios";
const baseURL = "https://gundam-model.onrender.com";
const localhostURL = "http://localhost:3000";

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
