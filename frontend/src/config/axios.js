import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    // Increase timeout for file uploads
    timeout: 60000, // 60 seconds
    validateStatus: (status) => {
        return status >= 200 && status < 500; // Handle only 5xx errors as errors
    }
})

// Add request interceptor for debugging
api.interceptors.request.use(
    config => {
        // Increase timeout specifically for upload endpoint
        if (config.url === '/api/songs/upload') {
            config.timeout = 120000; // 2 minutes for uploads
        }
        console.log('Request Details:', {
            url: config.baseURL + config.url,
            method: config.method,
            headers: config.headers
        })
        return config
    },
    error => {
        console.error('Request Configuration Error:', error)
        return Promise.reject(error)
    }
)

// Add response interceptor for error handling
api.interceptors.response.use(
    response => {
        console.log('Response Details:', {
            status: response.status,
            url: response.config.url,
            data: response.data ? 'Data received' : 'No data'
        })
        return response
    },
    error => {
        console.error('API Error Details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL
        })
        return Promise.reject(error)
    }
)

export default api 