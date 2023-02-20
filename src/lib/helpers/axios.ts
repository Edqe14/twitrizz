import axios from 'axios';

const fetcher = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export default fetcher;
