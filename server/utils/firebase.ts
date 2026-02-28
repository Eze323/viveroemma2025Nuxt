import { initializeApp, cert, getApps, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

/**
 * Initialize Firebase Admin SDK
 * 
 * Note: Firebase config should be provided via environment variables.
 * For production, use service account credentials.
 */
export const useFirebaseAdmin = () => {
    const apps = getApps();

    // In Nuxt, we might need a singleton-like pattern due to HMR
    if (apps.length === 0) {
        // Option A: Use service account file path from env
        // Option B: Construct from individual env vars (more flexible for cloud hosts)
        const serviceAccount: ServiceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };

        if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
            console.error('Firebase Admin credentials missing. Check your .env file.');
        }

        initializeApp({
            credential: cert(serviceAccount),
        });
    }

    return {
        auth: getAuth(),
    };
};
