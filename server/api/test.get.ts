import { users } from '~/src/db/schema';
// server/api/test.get.ts
import { db } from '~/server/utils/db';


export default defineEventHandler(async () => {
  try {
    // Consulta directa a la tabla 'users' usando Drizzle ORM
const result = await db.select().from(users);
    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
});