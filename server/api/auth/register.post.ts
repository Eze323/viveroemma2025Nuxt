import { useDrizzle } from '~/server/utils/drizzle';
import { users } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<RegisterBody>(event);
        const { name, email, password } = body;

        if (!name || !email || !password) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Faltan campos obligatorios (nombre, email, contraseña)',
            });
        }

        const db = useDrizzle();

        // 1. Check if user already exists
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser) {
            throw createError({
                statusCode: 409,
                statusMessage: 'Ya existe una cuenta con este correo electrónico.',
            });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create user
        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role: 'user', // Default role
            status: 'pending', // All new registrations are pending approval
        });

        return {
            success: true,
            message: 'Registro exitoso. Tu cuenta está pendiente de aprobación por el administrador.',
        };

    } catch (error: any) {
        console.error('Registration Error:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Error al registrar usuario',
        });
    }
});
