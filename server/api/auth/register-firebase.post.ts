import { useDrizzle } from '~/server/utils/drizzle';
import { users } from '~/server/db/schema';
import { eq, or } from 'drizzle-orm';
import { useFirebaseAdmin } from '~/server/utils/firebase';

interface RegisterBody {
    idToken: string;
    name: string;
    role?: 'admin' | 'encargado' | 'operario' | 'user' | 'reseller' | 'canastero';
}

/**
 * Endpoint for registration with Firebase.
 * 
 * 1. Verifies the Firebase ID Token.
 * 2. Checks if local user already exists.
 * 3. Creates the user in the local database with status 'pending'.
 */
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<RegisterBody>(event);
        const { idToken, name, role = 'user' } = body;

        if (!idToken || !name) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Faltan datos de registro (token o nombre)',
            });
        }

        const admin = useFirebaseAdmin();
        const db = useDrizzle();

        // 1. Verify the Firebase ID token
        const decodedToken = await admin.auth.verifyIdToken(idToken);
        const { uid, email } = decodedToken;

        if (!email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'El token de Firebase no contiene un correo electrónico.',
            });
        }

        // 2. Check if user already exists locally
        const [existingUser] = await db
            .select()
            .from(users)
            .where(
                or(
                    eq(users.email, email),
                    eq(users.firebaseUid, uid)
                )
            )
            .limit(1);

        if (existingUser) {
            throw createError({
                statusCode: 409,
                statusMessage: 'Ya existe una cuenta con este correo electrónico.',
            });
        }

        // 3. Create the user record as pending
        await db.insert(users).values({
            name,
            email,
            firebaseUid: uid,
            role: role as any,
            status: 'pending', // Requires manual approval
        });

        return {
            success: true,
            message: 'Registro exitoso. Tu cuenta está pendiente de aprobación por el administrador.',
        };

    } catch (error: any) {
        console.error('Registration Error:', error);

        const statusCode = error.statusCode || 500;
        const statusMessage = error.statusMessage || error.message || 'Error en el registro de usuario';

        throw createError({
            statusCode,
            statusMessage,
        });
    }
});
