// server/middleware/auth.ts
import { H3Event } from 'h3';

export default defineEventHandler(async (_event: H3Event) => {
  // Nota: La autenticación se maneja a nivel de endpoint o ruta mediante helpers como `requireAuth`.
  // Si se requiere validación global, descomentar e implementar la lógica correspondiente.
});