<template>
  <div v-if="showStatus" class="network-status" :class="statusClass">
    <div class="status-content">
      <Icon :name="statusIcon" class="status-icon" />
      <span class="status-text">{{ statusText }}</span>
      <button v-if="hasPending" @click="triggerSync" class="sync-button" :disabled="isSyncing">
        <Icon :name="isSyncing ? 'heroicons:arrow-path' : 'heroicons:cloud-arrow-up'" 
              :class="{ 'animate-spin': isSyncing }" 
              class="w-4 h-4" />
        <span v-if="!isSyncing">Sincronizar ({{ pendingCount }})</span>
        <span v-else">Sincronizando...</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNetworkStatus } from '~/composables/useNetworkStatus'
import { useSyncQueueStore } from '~/stores/syncQueue'
import { useSyncManager } from '~/composables/useSyncManager'

const { isOnline } = useNetworkStatus()
const syncQueue = useSyncQueueStore()
const { syncAll, isSyncing } = useSyncManager()

const showStatus = ref(false)
const autoHideTimeout = ref<NodeJS.Timeout | null>(null)

const pendingCount = computed(() => syncQueue.pendingCount)
const hasPending = computed(() => syncQueue.hasPendingOperations)

const statusClass = computed(() => {
  if (!isOnline.value) return 'status-offline'
  if (hasPending.value) return 'status-pending'
  return 'status-online'
})

const statusIcon = computed(() => {
  if (!isOnline.value) return 'heroicons:wifi-slash'
  if (hasPending.value) return 'heroicons:exclamation-triangle'
  return 'heroicons:wifi'
})

const statusText = computed(() => {
  if (!isOnline.value) return 'Sin conexión - Guardando localmente'
  if (hasPending.value) return `${pendingCount.value} operaciones pendientes`
  return 'Conectado'
})

const triggerSync = async () => {
  const result = await syncAll()
  
  if (result.success > 0) {
    console.log(`✅ ${result.success} operaciones sincronizadas`)
  }
  if (result.failed > 0) {
    console.warn(`⚠️ ${result.failed} operaciones fallaron`)
  }
}

// Show status when offline or has pending
watch([isOnline, hasPending], ([online, pending]) => {
  if (!online || pending) {
    showStatus.value = true
    
    // Clear previous timeout
    if (autoHideTimeout.value) {
      clearTimeout(autoHideTimeout.value)
    }
  } else {
    // Auto-hide after 3 seconds when online and no pending
    autoHideTimeout.value = setTimeout(() => {
      showStatus.value = false
    }, 3000)
  }
})

onMounted(() => {
  // Show initially if offline or has pending
  if (!isOnline.value || hasPending.value) {
    showStatus.value = true
  }
})
</script>

<style scoped>
.network-status {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(8px);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.status-online {
  background: rgba(16, 185, 129, 0.95);
  color: white;
}

.status-offline {
  background: rgba(239, 68, 68, 0.95);
  color: white;
}

.status-pending {
  background: rgba(245, 158, 11, 0.95);
  color: white;
}

.status-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.status-text {
  font-size: 14px;
  font-weight: 500;
}

.sync-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 8px;
}

.sync-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.sync-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Mobile */
@media (max-width: 640px) {
  .network-status {
    top: auto;
    bottom: 80px;
    right: 16px;
    left: 16px;
    max-width: calc(100% - 32px);
  }
  
  .status-content {
    flex-wrap: wrap;
  }
  
  .sync-button {
    margin-left: 0;
    margin-top: 8px;
    width: 100%;
    justify-content: center;
  }
}
</style>
