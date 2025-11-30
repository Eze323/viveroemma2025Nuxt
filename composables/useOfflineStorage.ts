// composables/useOfflineStorage.ts
import { ref } from 'vue'

interface StorageOptions {
    prefix?: string
    ttl?: number // Time to live in milliseconds
}

export const useOfflineStorage = (options: StorageOptions = {}) => {
    const { prefix = 'vivero', ttl } = options

    const getKey = (key: string) => `${prefix}_${key}`

    // Check if we're in the browser
    const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

    const set = <T>(key: string, value: T): boolean => {
        if (!isBrowser) return false

        try {
            const item = {
                data: value,
                timestamp: Date.now(),
                ttl
            }
            localStorage.setItem(getKey(key), JSON.stringify(item))
            return true
        } catch (error) {
            console.error('Error saving to localStorage:', error)
            return false
        }
    }

    const get = <T>(key: string): T | null => {
        if (!isBrowser) return null

        try {
            const item = localStorage.getItem(getKey(key))
            if (!item) return null

            const parsed = JSON.parse(item)

            // Check TTL
            if (parsed.ttl && Date.now() - parsed.timestamp > parsed.ttl) {
                remove(key)
                return null
            }

            return parsed.data as T
        } catch (error) {
            console.error('Error reading from localStorage:', error)
            return null
        }
    }

    const remove = (key: string): boolean => {
        if (!isBrowser) return false

        try {
            localStorage.removeItem(getKey(key))
            return true
        } catch (error) {
            console.error('Error removing from localStorage:', error)
            return false
        }
    }

    const clear = (): boolean => {
        if (!isBrowser) return false

        try {
            const keys = Object.keys(localStorage)
            keys.forEach(key => {
                if (key.startsWith(prefix)) {
                    localStorage.removeItem(key)
                }
            })
            return true
        } catch (error) {
            console.error('Error clearing localStorage:', error)
            return false
        }
    }

    const has = (key: string): boolean => {
        if (!isBrowser) return false
        return localStorage.getItem(getKey(key)) !== null
    }

    const size = (): number => {
        if (!isBrowser) return 0

        let total = 0
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
            if (key.startsWith(prefix)) {
                const item = localStorage.getItem(key)
                if (item) {
                    total += item.length
                }
            }
        })
        return total
    }

    return {
        set,
        get,
        remove,
        clear,
        has,
        size
    }
}
