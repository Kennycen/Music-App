import axios from 'axios'

// Remove any trailing slash from the base URL
const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

if (!baseURL) {
  console.error('VITE_API_URL is not defined in environment variables')
}

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add response interceptor for error handling
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response || error)
        return Promise.reject(error)
    }
)

export default api 