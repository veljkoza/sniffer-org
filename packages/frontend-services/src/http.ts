import axios from 'axios';

// const API_URL = 'https://sniffer-api.onrender.com';
const API_URL = 'http://localhost:4000';

const http = axios.create({
  baseURL: API_URL,
});

export { http };
