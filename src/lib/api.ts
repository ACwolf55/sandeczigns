import axios from 'axios'
import { getToken } from './auth'

// One shared axios instance pointed at the Express server.
// Set VITE_API_URL in .env (e.g. http://localhost:4000 for local dev).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Attach the admin JWT (when logged in) to every request so protected
// POST/DELETE routes accept it. Public GET requests just ignore it.
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
