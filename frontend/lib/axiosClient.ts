import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api/auth", // change to your API
  withCredentials: true,
});

export default axiosClient;
