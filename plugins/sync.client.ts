// plugins/sync.client.ts
export default defineNuxtPlugin(() => {
    if (process.client) {
        const { setupAutoSync } = useSyncManager()

        // Setup auto-sync on network reconnection
        setupAutoSync()

        console.log('✅ Auto-sync initialized')
    }
})
