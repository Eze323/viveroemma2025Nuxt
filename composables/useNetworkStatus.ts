// composables/useNetworkStatus.ts
import { ref, onMounted, onUnmounted } from 'vue'

export const useNetworkStatus = () => {
    const isOnline = ref(true)
    const wasOffline = ref(false)

    const updateOnlineStatus = () => {
        const previousStatus = isOnline.value
        isOnline.value = navigator.onLine

        // Detectar cuando vuelve la conexión
        if (!previousStatus && isOnline.value) {
            wasOffline.value = true
            // Trigger sync event
            window.dispatchEvent(new CustomEvent('network-reconnected'))
        }
    }

    onMounted(() => {
        isOnline.value = navigator.onLine
        window.addEventListener('online', updateOnlineStatus)
        window.addEventListener('offline', updateOnlineStatus)
    })

    onUnmounted(() => {
        window.removeEventListener('online', updateOnlineStatus)
        window.removeEventListener('offline', updateOnlineStatus)
    })

    return {
        isOnline,
        wasOffline
    }
}
