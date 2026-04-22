import axios from "axios";
//const baseURL = "http://localhost:3000";
const baseURL = "https://gundam-store-api.onrender.com";

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
