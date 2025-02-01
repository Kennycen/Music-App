import axios from 'axios'

// Remove any trailing slash from the base URL
const baseURL = import.meta.env.VITE_API_URL.replace(/\/$/, '')

const api = axios.create({
    baseURL: baseURL
})

export default api 