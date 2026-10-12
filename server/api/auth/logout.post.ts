import { defineEventHandler, deleteCookie } from 'h3'

export default defineEventHandler((event) => {
  deleteCookie(event, 'token', { path: '/' })
  deleteCookie(event, 'refresh_token', { path: '/api/auth/refresh' })

  return { success: true, message: 'Sesión cerrada.' }
})