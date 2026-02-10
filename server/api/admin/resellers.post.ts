import { db } from '~/server/utils/drizzle';
import { users, customers } from '~/server/db/schema';
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
    // Solo el admin debería poder registrar canasteros (puedes añadir middleware aquí)
    const body = await readBody(event);
    const { name, email, password, phone } = body;

    try {
        // 1. Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password || 'vivero123', 10);

        // 2. Transacción para asegurar que se creen ambos o ninguno
        return await db.transaction(async (tx) => {

            // Crear Usuario (Acceso)
            const [newUser] = await tx.insert(users).values({
                name,
                email,
                password: hashedPassword,
                role: 'canastero', // Rol específico
                points: 0,
                createdAt: new Date().toISOString(),
            });

            // Crear Cliente (Perfil Comercial)
            await tx.insert(customers).values({
                name,
                email,
                phone: phone || null,
                isRegular: 1, // Lo marcamos como cliente frecuente
                createdAt: new Date().toISOString(),
            });

            return { success: true, message: 'Canastero creado correctamente' };
        });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw createError({ statusCode: 400, statusMessage: 'El email ya está registrado' });
        }
        throw createError({ statusCode: 500, statusMessage: error.message });
    }
});