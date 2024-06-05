import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8080/api/',
  timeout: 0,
  headers: { Accept: 'application/json' }
})

api.interceptors.request.use((request) => {
  const session = localStorage.getItem('RBsession')
  if (session) {
    const { token } = JSON.parse(session)
    request.headers['Authorization'] = `Bearer ${token}`
  }

  return request
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)
