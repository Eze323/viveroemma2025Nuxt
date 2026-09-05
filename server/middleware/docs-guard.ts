// server/middleware/docs-guard.ts
import { getRequestURL, createError, defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  // La documentación sólo está accesible en desarrollo o si se define explícitamente ENABLE_DOCS='true'
  const isDocsEnabled = process.env.NODE_ENV !== 'production' || process.env.ENABLE_DOCS === 'true'

  if (!isDocsEnabled) {
    const url = getRequestURL(event).pathname

    // Oculta completamente /docs y /api-docs en producción respondiendo 404 Not Found
    if (url === '/docs' || url.startsWith('/docs/') || url === '/api-docs' || url.startsWith('/api-docs/')) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found'
      })
    }
  }
})
