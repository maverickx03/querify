import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', // or your deployed URL
  withCredentials: true,   
  headers: {
    "COntent-Type": "application/json"
  }         
});

export default API;
