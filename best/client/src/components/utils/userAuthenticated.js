import axios from 'axios'
import { Buffer } from 'buffer'

export const getTokenFromLocalStorage = () => {
  return window.localStorage.getItem('whats-the-best-token')
}

export const getPayload = () => {
  const token = getTokenFromLocalStorage()
  if (!token) return
  const splitToken = token.split('.')
  if (splitToken.length !== 3) return
  return JSON.parse(Buffer.from(splitToken[1], 'base64'))
}

export const userAuthenticated = () => {
  const payload = getPayload()
  if (!payload) return
  const currentTime = Math.round(Date.now() / 1000)
  return currentTime < payload.exp
}

export const getIpFromLocalStorage = () => {
  return window.localStorage.getItem('whats-the-best-IP')
}

export const getUsersIp = async () => {
  const savedIp = getIpFromLocalStorage()
  if (!savedIp) {
    const res = await axios.get('https://geolocation-db.com/json/')
    const ipAddress = await res.data.IPv4
    window.localStorage.setItem('whats-the-best-IP', ipAddress)
  }

  return getIpFromLocalStorage()
}

// export const userAuthenticated = () => {
//   const token = window.localStorage.getItem('whats-the-best-token')

//   const currentTime = Math.round(Date.now() / 1000)

//   if (!token) return

//   const splitToken = token.split('.')

//   if (splitToken.length !== 3) return

//   const payload = JSON.parse(Buffer.from(splitToken[1], 'base64'))

//   if (!payload) return

//   return currentTime < payload.exp
// }
