import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8080/api/',
  timeout: 0,
  headers: { Accept: 'application/json' }
})

api.interceptors.request.use((request) => {
  const session = localStorage.getItem('session')
  const token = session && JSON.parse(session).token

  if (token) request.headers.common['Authorization'] = `Bearer ${token}`

  return request
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.log(error?.response)
    return Promise.reject(error)
  }
)
