import { useDrizzle } from '~/server/utils/drizzle';
import { sales, saleItems, resellerOrders, resellerOrderItems, users } from '~/server/db/schema';
import { sql, eq, desc, sum, count, and, ne } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle();
        if (!db) throw new Error('DB connection failed');

        // 1. Global Stats - Admin Sales
        const [adminSalesStats] = await db
            .select({
                totalRevenue: sql<number>`COALESCE(sum(${sales.totalPrice}), 0)`,
                totalOrders: count(sales.id),
            })
            .from(sales);

        // 1b. Global Stats - Reseller Orders (exclude cancelled)
        const [resellerStats] = await db
            .select({
                totalRevenue: sql<number>`COALESCE(sum(${resellerOrders.total}), 0)`,
                totalOrders: count(resellerOrders.id),
            })
            .from(resellerOrders)
            .where(ne(resellerOrders.status, 'cancelled'));

        // 1c. Product Stats - Combined
        const [adminProductStats] = await db
            .select({
                totalProducts: sql<number>`COALESCE(sum(${saleItems.quantity}), 0)`,
            })
            .from(saleItems);

        const [resellerProductStats] = await db
            .select({
                totalProducts: sql<number>`COALESCE(sum(${resellerOrderItems.quantity}), 0)`,
            })
            .from(resellerOrderItems);

        // 2. Top Sellers - Admin Users (from sales table)
        const adminSellersData = await db
            .select({
                name: sales.seller,
                sales: sql<number>`COALESCE(sum(${sales.totalPrice}), 0)`,
                orders: count(sales.id),
            })
            .from(sales)
            .groupBy(sales.seller)
            .orderBy(desc(sql`sum(${sales.totalPrice})`))
            .limit(10);

        // Get product count per admin seller
        const adminSellersWithProducts = await Promise.all(adminSellersData.map(async (seller) => {
            const [pStats] = await db
                .select({
                    products: sql<number>`COALESCE(sum(${saleItems.quantity}), 0)`
                })
                .from(sales)
                .leftJoin(saleItems, eq(sales.id, saleItems.saleId))
                .where(eq(sales.seller, seller.name));

            return {
                id: seller.name,
                name: seller.name,
                sales: Number(seller.sales || 0),
                orders: Number(seller.orders || 0),
                products: Number(pStats?.products || 0),
                conversionRate: 0,
                type: 'admin' as const
            };
        }));

        // 2b. Top Sellers - Resellers (from reseller_orders table)
        const resellerSellersData = await db
            .select({
                userId: resellerOrders.userId,
                sales: sql<number>`COALESCE(sum(${resellerOrders.total}), 0)`,
                orders: count(resellerOrders.id),
            })
            .from(resellerOrders)
            .where(ne(resellerOrders.status, 'cancelled'))
            .groupBy(resellerOrders.userId)
            .orderBy(desc(sql`sum(${resellerOrders.total})`))
            .limit(10);

        // Get reseller names and product counts
        const resellerSellersWithProducts = await Promise.all(resellerSellersData.map(async (seller) => {
            const [user] = await db
                .select({ name: users.name })
                .from(users)
                .where(eq(users.id, seller.userId))
                .limit(1);

            const [pStats] = await db
                .select({
                    products: sql<number>`COALESCE(sum(${resellerOrderItems.quantity}), 0)`
                })
                .from(resellerOrders)
                .leftJoin(resellerOrderItems, eq(resellerOrders.id, resellerOrderItems.orderId))
                .where(and(
                    eq(resellerOrders.userId, seller.userId),
                    ne(resellerOrders.status, 'cancelled')
                ));

            return {
                id: `reseller-${seller.userId}`,
                name: user?.name || `Canastero #${seller.userId}`,
                sales: Number(seller.sales || 0),
                orders: Number(seller.orders || 0),
                products: Number(pStats?.products || 0),
                conversionRate: 0,
                type: 'reseller' as const
            };
        }));

        // Combine and sort all sellers by sales amount
        const allSellers = [...adminSellersWithProducts, ...resellerSellersWithProducts]
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);

        // 3. Recent Sales - Admin Sales
        const recentAdminSales = await db
            .select({
                id: sales.id,
                customer: sales.customer,
                email: sales.email,
                total: sales.totalPrice,
                date: sql`DATE_FORMAT(${sales.date}, '%d/%m/%Y')`,
                time: sales.time,
                status: sales.status,
                createdAt: sales.createdAt,
            })
            .from(sales)
            .orderBy(desc(sales.date), desc(sales.createdAt))
            .limit(10);

        // Count items for admin sales
        const recentAdminSalesWithCount = await Promise.all(recentAdminSales.map(async (sale) => {
            const [itemStat] = await db
                .select({ count: count(saleItems.id) })
                .from(saleItems)
                .where(eq(saleItems.saleId, sale.id));

            return {
                id: sale.id,
                customer: sale.customer,
                email: sale.email || '',
                items: itemStat?.count || 0,
                total: Number(sale.total),
                date: sale.date,
                time: sale.time || '',
                status: sale.status,
                type: 'admin' as const,
                createdAt: sale.createdAt
            };
        }));

        // 3b. Recent Sales - Reseller Orders
        const recentResellerOrders = await db
            .select({
                id: resellerOrders.id,
                userId: resellerOrders.userId,
                total: resellerOrders.total,
                status: resellerOrders.status,
                createdAt: resellerOrders.createdAt,
            })
            .from(resellerOrders)
            .where(ne(resellerOrders.status, 'cancelled'))
            .orderBy(desc(resellerOrders.createdAt))
            .limit(10);

        // Get reseller names and item counts
        const recentResellerOrdersWithDetails = await Promise.all(recentResellerOrders.map(async (order) => {
            const [user] = await db
                .select({ name: users.name, email: users.email })
                .from(users)
                .where(eq(users.id, order.userId))
                .limit(1);

            const [itemStat] = await db
                .select({ count: count(resellerOrderItems.id) })
                .from(resellerOrderItems)
                .where(eq(resellerOrderItems.orderId, order.id));

            // Format date from timestamp
            const dateObj = order.createdAt ? new Date(order.createdAt) : new Date();
            const formattedDate = dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const formattedTime = dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

            return {
                id: order.id,
                customer: user?.name || `Canastero #${order.userId}`,
                email: user?.email || '',
                items: itemStat?.count || 0,
                total: Number(order.total),
                date: formattedDate,
                time: formattedTime,
                status: order.status,
                type: 'reseller' as const,
                createdAt: order.createdAt
            };
        }));

        // Combine and sort all recent transactions by creation date
        const allRecentSales = [...recentAdminSalesWithCount, ...recentResellerOrdersWithDetails]
            .sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            })
            .slice(0, 5)
            .map(({ createdAt, ...rest }) => rest); // Remove createdAt from final output

        return {
            success: true,
            data: {
                stats: {
                    revenue: Number(adminSalesStats?.totalRevenue || 0) + Number(resellerStats?.totalRevenue || 0),
                    orders: Number(adminSalesStats?.totalOrders || 0) + Number(resellerStats?.totalOrders || 0),
                    products: Number(adminProductStats?.totalProducts || 0) + Number(resellerProductStats?.totalProducts || 0),
                },
                topSellers: allSellers,
                recentSales: allRecentSales
            }
        };

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            success: false,
            error: 'Failed to fetch dashboard stats'
        };
    }
});
