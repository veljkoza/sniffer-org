import axios from 'axios';
const API_URL = process.env['API_URl'] || 'https://sniffer-api.onrender.com';

const http = axios.create({
  baseURL: API_URL,
});

export { http };
