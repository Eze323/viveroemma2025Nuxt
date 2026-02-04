import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface DashboardStats {
    revenue: number
    orders: number
    products: number
}

export interface SellerStat {
    id: string
    name: string
    sales: number
    orders: number
    products: number
    conversionRate: number
    type?: 'admin' | 'reseller'
}

export interface RecentSale {
    id: number
    customer: string
    email: string
    total: number
    date: string
    time: string
    status: string
    items: number
    type?: 'admin' | 'reseller'
}

export const useDashboardStore = defineStore('dashboard', () => {
    const stats = ref<DashboardStats>({ revenue: 0, orders: 0, products: 0 })
    const topSellers = ref<SellerStat[]>([])
    const recentSales = ref<RecentSale[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchDashboardData = async () => {
        loading.value = true
        error.value = null
        try {
            const { data, success, error: apiError } = await $fetch<{ success: boolean, data: any, error?: string }>('/api/dashboard/stats')

            if (success && data) {
                stats.value = data.stats
                topSellers.value = data.topSellers
                recentSales.value = data.recentSales
            } else {
                error.value = apiError || 'Error loading dashboard data'
            }
        } catch (err) {
            console.error('Error fetching dashboard stats:', err)
            error.value = 'Failed to load dashboard data'
        } finally {
            loading.value = false
        }
    }

    return {
        stats,
        topSellers,
        recentSales,
        loading,
        error,
        fetchDashboardData
    }
})
