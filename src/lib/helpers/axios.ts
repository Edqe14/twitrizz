import axios from 'axios';
import SuperJSON from 'superjson';

const fetcher = axios.create({
  baseURL: '/api',
  withCredentials: true,
  transformResponse(res) {
    return SuperJSON.parse(res);
  },
  responseType: 'json',
});

export default fetcher;
