import axios from 'axios'

// Remove any trailing slash from the base URL
const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

if (!baseURL) {
  console.error('VITE_API_URL is not defined in environment variables')
} else {
    console.log('API Base URL:', baseURL) // Debug log
}

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add request interceptor for debugging
api.interceptors.request.use(
    config => {
        console.log('Making request to:', config.baseURL + config.url)
        return config
    },
    error => {
        console.error('Request error:', error)
        return Promise.reject(error)
    }
)

// Add response interceptor for error handling
api.interceptors.response.use(
    response => {
        console.log('Received response:', response.status)
        return response
    },
    error => {
        console.error('API Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            url: error.config?.url
        })
        return Promise.reject(error)
    }
)

export default api 