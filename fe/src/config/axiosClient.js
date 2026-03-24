import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://gundam-model.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;