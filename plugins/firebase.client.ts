import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Handle Firebase initialization on the client side.
 * 
 * Config should be provided via environment variables.
 */
export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig().public;
    const firebaseConfig = {
        apiKey: config.firebaseApiKey,
        authDomain: config.firebaseAuthDomain,
        projectId: config.firebaseProjectId,
        storageBucket: config.firebaseStorageBucket,
        messagingSenderId: config.firebaseMessagingSenderId,
        appId: config.firebaseAppId,
    };

    // Initialize Firebase if it hasn't been already
    const apps = getApps();
    const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];
    const auth = getAuth(app);

    return {
        provide: {
            firebaseAuth: auth,
        }
    }
});
