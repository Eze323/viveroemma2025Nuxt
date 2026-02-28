import { useDrizzle } from '~/server/utils/drizzle';
import { users } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { useFirebaseAdmin } from '~/server/utils/firebase';
import jwt from 'jsonwebtoken';

interface LoginFirebaseBody {
    idToken: string;
}

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
}
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Endpoint for login via Firebase.
 */
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<LoginFirebaseBody>(event);
        const { idToken } = body;

        const admin = useFirebaseAdmin();
        const db = useDrizzle();

        // 1. Verify the Firebase token
        const decodedToken = await admin.auth.verifyIdToken(idToken);
        const { uid, email } = decodedToken;

        if (!email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'El token de Firebase no contiene un correo electrónico.',
            });
        }

        // 2. Find user in the local database
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: 'No se encontró una cuenta con este correo electrónico. Regístrate primero.',
            });
        }

        // 3. CHECK THE APPROVAL STATUS
        if (!user.status || user.status === 'pending') {
            throw createError({
                statusCode: 403,
                statusMessage: 'Tu cuenta está pendiente de aprobación por el administrador.',
            });
        }

        if (user.status === 'suspended') {
            throw createError({
                statusCode: 403,
                statusMessage: 'Tu cuenta ha sido suspendida. Contacta al administrador.',
            });
        }

        // 4. Update Firebase UID if not present
        if (!user.firebaseUid) {
            await db.update(users)
                .set({ firebaseUid: uid })
                .where(eq(users.id, user.id));
        }

        // 5. Generate Access Token (15m) and Refresh Token (7d)
        // Re-using the logic from login.post.ts for consistency
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email, role: user.role, type: 'access' },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id, type: 'refresh' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Cookies
        setCookie(event, 'refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api/auth/refresh',
            maxAge: 7 * 24 * 60 * 60,
        });

        setCookie(event, 'token', accessToken, {
            httpOnly: false,
            path: '/',
            maxAge: 15 * 60,
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                points: user.points,
            },
            token: accessToken,
        };

    } catch (error: any) {
        console.error('Login Error:', error);

        const statusCode = error.statusCode || 500;
        const statusMessage = error.statusMessage || error.message || 'Error en el inicio de sesión';

        throw createError({
            statusCode,
            statusMessage,
        });
    }
});
