import { useDrizzle } from '~/server/utils/drizzle';
import { sales, saleItems } from '~/server/db/schema';
import { sql, eq, desc, sum, count } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle();
        if (!db) throw new Error('DB connection failed');

        // 1. Global Stats
        const [globalStats] = await db
            .select({
                totalRevenue: sql<number>`sum(${sales.totalPrice})`,
                totalOrders: count(sales.id),
            })
            .from(sales);

        const [productStats] = await db
            .select({
                totalProducts: sql<number>`sum(${saleItems.quantity})`,
            })
            .from(saleItems);

        // 2. Top Sellers
        // Group by seller name since it's stored directly in sales table
        // Fetch aggregated data per seller
        const sellersData = await db
            .select({
                name: sales.seller,
                sales: sql<number>`sum(${sales.totalPrice})`,
                orders: count(sales.id),
            })
            .from(sales)
            .groupBy(sales.seller)
            .orderBy(desc(sql`sum(${sales.totalPrice})`))
            .limit(5);

        // Get product count per seller (requires join)
        // This might be expensive, so we'll do it separately or join deeply if needed.
        // For now, let's keep it simple. If we need product count per seller:
        const sellersWithProducts = await Promise.all(sellersData.map(async (seller) => {
            const [pStats] = await db
                .select({
                    products: sql<number>`sum(${saleItems.quantity})`
                })
                .from(sales)
                .leftJoin(saleItems, eq(sales.id, saleItems.saleId))
                .where(eq(sales.seller, seller.name));

            return {
                ...seller,
                id: seller.name, // Use name as ID for now or fetch user ID if available
                sales: Number(seller.sales || 0),
                orders: Number(seller.orders || 0),
                products: Number(pStats?.products || 0),
                conversionRate: 0 // Placeholder as we don't track store visits
            };
        }));

        // 3. Recent Sales (re-use logic or just fetch simplified)
        const recentSales = await db
            .select({
                id: sales.id,
                customer: sales.customer, // Use customer name stored in sales
                email: sales.email,
                total: sales.totalPrice,
                date: sql`DATE_FORMAT(${sales.date}, '%d/%m/%Y')`,
                time: sales.time,
                status: sales.status,
            })
            .from(sales)
            .orderBy(desc(sales.date), desc(sales.createdAt))
            .limit(5);

        // Count items for recent sales
        const recentSalesWithCount = await Promise.all(recentSales.map(async (sale) => {
            const [itemStat] = await db
                .select({ count: count(saleItems.id) })
                .from(saleItems)
                .where(eq(saleItems.saleId, sale.id));

            return {
                ...sale,
                items: itemStat?.count || 0,
                total: Number(sale.total)
            };
        }));

        return {
            success: true,
            data: {
                stats: {
                    revenue: Number(globalStats?.totalRevenue || 0),
                    orders: Number(globalStats?.totalOrders || 0),
                    products: Number(productStats?.totalProducts || 0),
                },
                topSellers: sellersWithProducts,
                recentSales: recentSalesWithCount
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
