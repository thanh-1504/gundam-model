import axios from "axios";
const baseURL = "https://gundam-store-api.onrender.com";

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
