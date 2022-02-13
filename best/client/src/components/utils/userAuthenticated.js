import { Buffer } from 'buffer'

export const userAuthenticated = () => {

  const token = window.localStorage.getItem('whats-the-best-token')
  
  const currentTime = Math.round(Date.now() / 1000)

  if (!token) return

  const splitToken = token.split('.')

  if (splitToken.length !== 3) return

  const payload = JSON.parse(Buffer.from(splitToken[1], 'base64'))

  if (!payload) return

  return currentTime < payload.exp

}