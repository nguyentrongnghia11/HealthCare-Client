import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.1.14:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

export default instance;
