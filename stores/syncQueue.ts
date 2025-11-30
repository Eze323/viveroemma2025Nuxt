// stores/syncQueue.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useOfflineStorage } from '~/composables/useOfflineStorage'

export interface PendingOperation {
    id: string
    type: 'sale' | 'product'
    action: 'create' | 'update' | 'delete'
    data: any
    timestamp: number
    retries: number
    error?: string
}

export const useSyncQueueStore = defineStore('syncQueue', () => {
    const storage = useOfflineStorage({ prefix: 'sync_queue' })
    const queue = ref<PendingOperation[]>([])
    const isSyncing = ref(false)
    const lastSyncTime = ref<number | null>(null)

    // Load queue from localStorage (only in browser)
    const loadQueue = () => {
        if (typeof window === 'undefined') return
        
        const saved = storage.get<PendingOperation[]>('operations')
        if (saved) {
            queue.value = saved
        }
    }

    // Save queue to localStorage (only in browser)
    const saveQueue = () => {
        if (typeof window === 'undefined') return
        storage.set('operations', queue.value)
    }

    // Add operation to queue
    const addOperation = (operation: Omit<PendingOperation, 'id' | 'timestamp' | 'retries'>) => {
        const newOp: PendingOperation = {
            ...operation,
            id: `${ operation.type }_${ operation.action }_${ Date.now() }_${ Math.random() } `,
            timestamp: Date.now(),
            retries: 0
        }

        queue.value.push(newOp)
        saveQueue()

        return newOp.id
    }

    // Remove operation from queue
    const removeOperation = (id: string) => {
        queue.value = queue.value.filter(op => op.id !== id)
        saveQueue()
    }

    // Update operation (for retries)
    const updateOperation = (id: string, updates: Partial<PendingOperation>) => {
        const index = queue.value.findIndex(op => op.id === id)
        if (index !== -1) {
            queue.value[index] = { ...queue.value[index], ...updates }
            saveQueue()
        }
    }

    // Clear all operations
    const clearQueue = () => {
        queue.value = []
        saveQueue()
    }

    // Clear old operations (> 7 days) - only in browser
    const clearOldOperations = () => {
        if (typeof window === 'undefined') return
        
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
        queue.value = queue.value.filter(op => op.timestamp > sevenDaysAgo)
        saveQueue()
    }

    // Computed
    const pendingCount = computed(() => queue.value.length)

    const hasPendingOperations = computed(() => queue.value.length > 0)

    const operationsByType = computed(() => {
        return queue.value.reduce((acc, op) => {
            const key = `${ op.type }_${ op.action } `
            acc[key] = (acc[key] || 0) + 1
            return acc
        }, {} as Record<string, number>)
    })

    // Initialize only in browser
    if (typeof window !== 'undefined') {
        loadQueue()
        clearOldOperations()
    }

    return {
        // State
        queue,
        isSyncing,
        lastSyncTime,

        // Actions
        addOperation,
        removeOperation,
        updateOperation,
        clearQueue,
        clearOldOperations,
        loadQueue,

        // Getters
        pendingCount,
        hasPendingOperations,
        operationsByType
    }
})
