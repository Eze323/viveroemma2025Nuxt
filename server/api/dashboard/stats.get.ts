import { useDrizzle } from '~/server/utils/drizzle';
import { sales, saleItems, resellerOrders, resellerOrderItems, users } from '~/server/db/schema';
import { sql, eq, desc, sum, count, and, ne } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle();
        if (!db) throw new Error('DB connection failed');

        const todayStr = new Date().toISOString().split('T')[0];

        // 1. Estadísticas Globales (Para los cuadritos de arriba)
        const [adminSalesStats] = await db
            .select({
                totalRevenue: sql<number>`COALESCE(sum(${sales.totalPrice}), 0)`,
                totalOrders: count(sales.id),
            })
            .from(sales)
            .where(ne(sales.status, 'Anulada'));

        const [resellerStats] = await db
            .select({
                totalRevenue: sql<number>`COALESCE(sum(${resellerOrders.total}), 0)`,
                totalOrders: count(resellerOrders.id),
            })
            .from(resellerOrders)
            .where(ne(resellerOrders.status, 'cancelled'));

        // 2. Ventas de Hoy
        const [adminToday] = await db
            .select({
                revenue: sql<number>`COALESCE(sum(${sales.totalPrice}), 0)`,
                products: sql<number>`COALESCE(sum(${saleItems.quantity}), 0)`
            })
            .from(sales)
            .leftJoin(saleItems, eq(sales.id, saleItems.saleId))
            .where(and(
                sql`DATE(${sales.date}) = ${todayStr}`,
                ne(sales.status, 'Anulada')
            ));

        const [resellerToday] = await db
            .select({
                revenue: sql<number>`COALESCE(sum(${resellerOrders.total}), 0)`,
                products: sql<number>`COALESCE(sum(${resellerOrderItems.quantity}), 0)`
            })
            .from(resellerOrders)
            .leftJoin(resellerOrderItems, eq(resellerOrders.id, resellerOrderItems.orderId))
            .where(and(
                sql`DATE(${resellerOrders.createdAt}) = ${todayStr}`,
                ne(resellerOrders.status, 'cancelled')
            ));

        // 3. Ventas Recientes Unificadas (Lo que alimenta tu frontend)

        // --- 3a. Obtener Ventas de Admin ---
        const recentAdmin = await db
            .select({
                id: sales.id,
                customer: sales.customer,
                total: sales.totalPrice,
                status: sales.status,
                createdAt: sales.createdAt,
                time: sales.time,
                type: sql<'admin'>`'admin'`
            })
            .from(sales)
            .orderBy(desc(sales.createdAt))
            .limit(10);

        const adminWithItems = await Promise.all(recentAdmin.map(async (sale) => {
            const [itemStat] = await db
                .select({ sum: sql<number>`COALESCE(sum(${saleItems.quantity}), 0)` })
                .from(saleItems)
                .where(eq(saleItems.saleId, sale.id));
            return { ...sale, items: Number(itemStat?.sum || 0) };
        }));

        // --- 3b. Obtener Ventas de Canasteros ---
        const recentResellers = await db
            .select({
                id: resellerOrders.id,
                customer: users.name,
                total: resellerOrders.total,
                status: resellerOrders.status,
                createdAt: resellerOrders.createdAt,
                type: sql<'reseller'>`'reseller'`
            })
            .from(resellerOrders)
            .leftJoin(users, eq(resellerOrders.userId, users.id))
            .orderBy(desc(resellerOrders.createdAt))
            .limit(10);

        const resellerWithItems = await Promise.all(recentResellers.map(async (order) => {
            const [itemStat] = await db
                .select({ sum: sql<number>`COALESCE(sum(${resellerOrderItems.quantity}), 0)` })
                .from(resellerOrderItems)
                .where(eq(resellerOrderItems.orderId, order.id));

            const dateObj = order.createdAt ? new Date(order.createdAt) : new Date();
            return {
                ...order,
                items: Number(itemStat?.sum || 0),
                time: dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
            };
        }));

        // 4. Mezcla, Orden y Formateo Final
        const allRecentSales = [...adminWithItems, ...resellerWithItems]
            .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
            .slice(0, 10)
            .map(sale => ({
                id: sale.id,
                customer: sale.customer || 'Cliente Mostrador',
                total: Number(sale.total),
                status: sale.status,
                type: sale.type,
                items: sale.items,
                time: sale.time || '00:00',
                date: sale.createdAt ? new Date(sale.createdAt).toLocaleDateString('es-AR') : ''
            }));

        return {
            success: true,
            data: {
                stats: {
                    revenue: Number(adminSalesStats?.totalRevenue || 0) + Number(resellerStats?.totalRevenue || 0),
                    orders: Number(adminSalesStats?.totalOrders || 0) + Number(resellerStats?.totalOrders || 0),
                    revenueToday: Number(adminToday?.revenue || 0) + Number(resellerToday?.revenue || 0),
                    productsToday: Number(adminToday?.products || 0) + Number(resellerToday?.products || 0),
                },
                recentSales: allRecentSales
            }
        };

    } catch (error) {
        console.error('Dashboard Error:', error);
        return { success: false, error: 'Error al cargar estadísticas' };
    }
});