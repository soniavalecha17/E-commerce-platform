import axios from "axios";

const API = axios.create({
  // Use your actual backend URL
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true, // This is the most important part for Cookies
});

// We don't need the interceptor if we are using HTTP-Only Cookies.
// Keeping it can sometimes cause CORS issues if the server isn't 
// expecting the Authorization header.

export default API;