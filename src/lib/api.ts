import axios from 'axios'

// One shared axios instance pointed at the Express server.
// Set VITE_API_URL in .env (e.g. http://localhost:4000 for local dev).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export default api
