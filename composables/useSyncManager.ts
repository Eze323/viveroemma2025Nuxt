// composables/useSyncManager.ts
import { ref } from 'vue'
import { useSyncQueueStore } from '~/stores/syncQueue'
import { useApiService } from '~/services/api/api'
import type { PendingOperation } from '~/stores/syncQueue'

export const useSyncManager = () => {
    const syncQueue = useSyncQueueStore()
    const api = useApiService()
    const isSyncing = ref(false)
    const syncErrors = ref<string[]>([])

    // Backoff delays: 1s, 2s, 4s, 8s, 16s
    const getBackoffDelay = (retries: number): number => {
        return Math.min(1000 * Math.pow(2, retries), 16000)
    }

    // Process a single operation
    const processOperation = async (operation: PendingOperation): Promise<boolean> => {
        try {
            let response

            switch (operation.type) {
                case 'sale':
                    if (operation.action === 'create') {
                        response = await api.createSale(operation.data)
                    } else if (operation.action === 'update') {
                        response = await api.updateSale(operation.data.id, operation.data)
                    } else if (operation.action === 'delete') {
                        response = await api.deleteSale(operation.data.id)
                    }
                    break

                case 'product':
                    if (operation.action === 'create') {
                        response = await api.createProduct(operation.data)
                    } else if (operation.action === 'update') {
                        response = await api.updateProduct(operation.data.id, operation.data)
                    } else if (operation.action === 'delete') {
                        response = await api.deleteProduct(operation.data.id)
                    }
                    break
            }

            if (response && response.success) {
                return true
            } else {
                throw new Error(response?.error || 'Operation failed')
            }
        } catch (error: any) {
            console.error('Error processing operation:', error)
            throw error
        }
    }

    // Sync all pending operations
    const syncAll = async (): Promise<{ success: number; failed: number }> => {
        if (isSyncing.value) {
            // console.log('Sync already in progress')
            return { success: 0, failed: 0 }
        }

        isSyncing.value = true
        syncErrors.value = []

        let successCount = 0
        let failedCount = 0

        const operations = [...syncQueue.queue]

        for (const operation of operations) {
            try {
                // Check max retries
                if (operation.retries >= 5) {
                    console.error('Max retries reached for operation:', operation.id)
                    syncErrors.value.push(`Operación ${operation.id} falló después de 5 intentos`)
                    syncQueue.removeOperation(operation.id)
                    failedCount++
                    continue
                }

                // Apply backoff delay if retries > 0
                if (operation.retries > 0) {
                    const delay = getBackoffDelay(operation.retries)
                    await new Promise(resolve => setTimeout(resolve, delay))
                }

                // Process operation
                const success = await processOperation(operation)

                if (success) {
                    syncQueue.removeOperation(operation.id)
                    successCount++
                } else {
                    // Increment retries
                    syncQueue.updateOperation(operation.id, {
                        retries: operation.retries + 1,
                        error: 'Operation failed'
                    })
                    failedCount++
                }
            } catch (error: any) {
                // Increment retries on error
                syncQueue.updateOperation(operation.id, {
                    retries: operation.retries + 1,
                    error: error.message || 'Unknown error'
                })
                failedCount++
            }
        }

        isSyncing.value = false
        syncQueue.lastSyncTime = Date.now()

        return { success: successCount, failed: failedCount }
    }

    // Auto-sync when network reconnects
    const setupAutoSync = () => {
        if (process.client) {
            window.addEventListener('network-reconnected', async () => {
                // console.log('Network reconnected, starting auto-sync...')
                const result = await syncAll()
                // console.log('Auto-sync completed:', result)

                // Show notification
                if (result.success > 0) {
                    // You can use a toast/notification library here
                    console.log(`✅ ${result.success} operaciones sincronizadas`)
                }
                if (result.failed > 0) {
                    console.warn(`⚠️ ${result.failed} operaciones fallaron`)
                }
            })
        }
    }

    return {
        isSyncing,
        syncErrors,
        syncAll,
        setupAutoSync
    }
}
