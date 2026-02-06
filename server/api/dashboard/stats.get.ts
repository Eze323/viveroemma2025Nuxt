// import { useDrizzle } from '~/server/utils/drizzle';
// import { sales, saleItems, resellerOrders, resellerOrderItems, users } from '~/server/db/schema';
// import { sql, eq, desc, sum, count, and, ne } from 'drizzle-orm';

// export default defineEventHandler(async (event) => {
//     try {
//         const db = useDrizzle();
//         if (!db) throw new Error('DB connection failed');

//         // 1. Global Stats - Admin Sales (EXCLUDE cancelled if status exists, though admin sales usually default to 'Completada')
//         const [adminSalesStats] = await db
//             .select({
//                 totalRevenue: sql<number>`COALESCE(sum(${sales.totalPrice}), 0)`,
//                 totalOrders: count(sales.id),
//             })
//             .from(sales)
//             .where(ne(sales.status, 'Anulada')); // Assuming 'Anulada' is cancelled for admin sales

//         // 1b. Global Stats - Reseller Orders (exclude cancelled)
//         const [resellerStats] = await db
//             .select({
//                 totalRevenue: sql<number>`COALESCE(sum(${resellerOrders.total}), 0)`,
//                 totalOrders: count(resellerOrders.id),
//             })
//             .from(resellerOrders)
//             .where(ne(resellerOrders.status, 'cancelled'));

//         // 1c. Product Stats - Combined (EXCLUDING cancelled)
//         const [adminProductStats] = await db
//             .select({
//                 totalProducts: sql<number>`COALESCE(sum(${saleItems.quantity}), 0)`,
//             })
//             .from(saleItems)
//             .innerJoin(sales, eq(saleItems.saleId, sales.id))
//             .where(ne(sales.status, 'Anulada'));

//         const [resellerProductStats] = await db
//             .select({
//                 totalProducts: sql<number>`COALESCE(sum(${resellerOrderItems.quantity}), 0)`,
//             })
//             .from(resellerOrderItems)
//             .innerJoin(resellerOrders, eq(resellerOrderItems.orderId, resellerOrders.id))
//             .where(ne(resellerOrders.status, 'cancelled'));

//         // 2. Top Sellers - Admin Users
//         // const adminSellersData = await db
//         //     .select({
//         //         name: sales.seller,
//         //         sales: sql<number>`COALESCE(sum(${sales.totalPrice}), 0)`,
//         //         orders: count(sales.id),
//         //     })
//         //     .from(sales)
//         //     .where(ne(sales.status, 'Anulada'))
//         //     .groupBy(sales.seller)
//         //     .orderBy(desc(sql`sum(${sales.totalPrice})`))
//         //     .limit(10);
//         const adminSellersData = await db
//             .select({
//                 name: sales.seller,
//                 sales: sql<number>`sum(${sales.totalPrice})`,
//                 orders: count(sales.id),
//                 products: sql<number>`sum(${saleItems.quantity})` // Traemos todo de una
//             })
//             .from(sales)
//             .leftJoin(saleItems, eq(sales.id, saleItems.saleId))
//             .where(ne(sales.status, 'Anulada'))
//             .groupBy(sales.seller)
//             .orderBy(desc(sql`sum(${sales.totalPrice})`))
//             .limit(10);

//         const adminSellersWithProducts = await Promise.all(adminSellersData.map(async (seller) => {
//             const [pStats] = await db
//                 .select({
//                     products: sql<number>`COALESCE(sum(${saleItems.quantity}), 0)`
//                 })
//                 .from(sales)
//                 .leftJoin(saleItems, eq(sales.id, saleItems.saleId))
//                 .where(and(eq(sales.seller, seller.name), ne(sales.status, 'Anulada')));

//             return {
//                 id: seller.name,
//                 name: seller.name,
//                 sales: Number(seller.sales || 0),
//                 orders: Number(seller.orders || 0),
//                 products: Number(pStats?.products || 0),
//                 conversionRate: 0,
//                 type: 'admin' as const
//             };
//         }));

//         // 2b. Top Sellers - Resellers
//         const resellerSellersData = await db
//             .select({
//                 userId: resellerOrders.userId,
//                 sales: sql<number>`COALESCE(sum(${resellerOrders.total}), 0)`,
//                 orders: count(resellerOrders.id),
//             })
//             .from(resellerOrders)
//             .where(ne(resellerOrders.status, 'cancelled'))
//             .groupBy(resellerOrders.userId)
//             .orderBy(desc(sql`sum(${resellerOrders.total})`))
//             .limit(10);

//         const resellerSellersWithProducts = await Promise.all(resellerSellersData.map(async (seller) => {
//             const [user] = await db
//                 .select({ name: users.name })
//                 .from(users)
//                 .where(eq(users.id, seller.userId))
//                 .limit(1);

//             const [pStats] = await db
//                 .select({
//                     products: sql<number>`COALESCE(sum(${resellerOrderItems.quantity}), 0)`
//                 })
//                 .from(resellerOrders)
//                 .leftJoin(resellerOrderItems, eq(resellerOrders.id, resellerOrderItems.orderId))
//                 .where(and(
//                     eq(resellerOrders.userId, seller.userId),
//                     ne(resellerOrders.status, 'cancelled')
//                 ));

//             return {
//                 id: `reseller-${seller.userId}`,
//                 name: user?.name || `Canastero #${seller.userId}`,
//                 sales: Number(seller.sales || 0),
//                 orders: Number(seller.orders || 0),
//                 products: Number(pStats?.products || 0),
//                 conversionRate: 0,
//                 type: 'reseller' as const
//             };
//         }));

//         const allSellers = [...adminSellersWithProducts, ...resellerSellersWithProducts]
//             .sort((a, b) => b.sales - a.sales)
//             .slice(0, 5);

//         // 1d. Stats for "Today" (SimpleDashboard)
//         const todayStr = new Date().toISOString().split('T')[0];

//         // Admin sales today
//         const [adminToday] = await db
//             .select({
//                 revenue: sql<number>`COALESCE(sum(${sales.totalPrice}), 0)`,
//                 products: sql<number>`COALESCE(sum(${saleItems.quantity}), 0)`
//             })
//             .from(sales)
//             .leftJoin(saleItems, eq(sales.id, saleItems.saleId))
//             .where(and(
//                 sql`DATE(${sales.date}) = ${todayStr}`,
//                 ne(sales.status, 'Anulada')
//             ));

//         // Reseller orders today
//         const [resellerToday] = await db
//             .select({
//                 revenue: sql<number>`COALESCE(sum(${resellerOrders.total}), 0)`,
//                 products: sql<number>`COALESCE(sum(${resellerOrderItems.quantity}), 0)`
//             })
//             .from(resellerOrders)
//             .leftJoin(resellerOrderItems, eq(resellerOrders.id, resellerOrderItems.orderId))
//             .where(and(
//                 sql`DATE(${resellerOrders.createdAt}) = ${todayStr}`,
//                 ne(resellerOrders.status, 'cancelled')
//             ));

//         // 1e. Top Customers (Buyers) - Admin Sales table
//         const topCustomersData = await db
//             .select({
//                 name: sales.customer,
//                 total: sql<number>`COALESCE(sum(${sales.totalPrice}), 0)`,
//                 orders: count(sales.id),
//             })
//             .from(sales)
//             .where(and(
//                 ne(sales.status, 'Anulada'),
//                 ne(sales.customer, 'Cliente Mostrador'),
//                 ne(sales.customer, 'MOSTRADOR'),
//                 ne(sales.customer, '')
//             ))
//             .groupBy(sales.customer)
//             .orderBy(desc(sql`sum(${sales.totalPrice})`))
//             .limit(5);

//         const topCustomers = await Promise.all(topCustomersData.map(async (customer) => {
//             const [pStats] = await db
//                 .select({
//                     products: sql<number>`COALESCE(sum(${saleItems.quantity}), 0)`
//                 })
//                 .from(sales)
//                 .leftJoin(saleItems, eq(sales.id, saleItems.saleId))
//                 .where(and(eq(sales.customer, customer.name), ne(sales.status, 'Anulada')));

//             return {
//                 id: customer.name,
//                 name: customer.name,
//                 sales: Number(customer.total || 0),
//                 orders: Number(customer.orders || 0),
//                 products: Number(pStats?.products || 0),
//             };
//         }));

//         // 3. Recent Sales - Admin Sales
//         const recentAdminSales = await db
//             .select({
//                 id: sales.id,
//                 customer: sales.customer,
//                 email: sales.email,
//                 total: sales.totalPrice,
//                 date: sql`DATE_FORMAT(${sales.date}, '%d/%m/%Y')`,
//                 time: sales.time,
//                 status: sales.status,
//                 createdAt: sales.createdAt,
//             })
//             .from(sales)
//             .orderBy(desc(sales.date), desc(sales.createdAt))
//             .limit(10);

//         const recentAdminSalesWithCount = await Promise.all(recentAdminSales.map(async (sale) => {
//             const [itemStat] = await db
//                 .select({ sum: sql<number>`COALESCE(sum(${saleItems.quantity}), 0)` })
//                 .from(saleItems)
//                 .where(eq(saleItems.saleId, sale.id));

//             return {
//                 id: sale.id,
//                 customer: sale.customer,
//                 email: sale.email || '',
//                 items: Number(itemStat?.sum || 0),
//                 total: Number(sale.total),
//                 date: sale.date,
//                 time: sale.time || '',
//                 status: sale.status,
//                 type: 'admin' as const,
//                 createdAt: sale.createdAt
//             };
//         }));

//         // 3b. Recent Sales - Reseller Orders
//         const recentResellerOrders = await db
//             .select({
//                 id: resellerOrders.id,
//                 userId: resellerOrders.userId,
//                 total: resellerOrders.total,
//                 status: resellerOrders.status,
//                 createdAt: resellerOrders.createdAt,
//             })
//             .from(resellerOrders)
//             .where(ne(resellerOrders.status, 'cancelled'))
//             .orderBy(desc(resellerOrders.createdAt))
//             .limit(10);

//         const recentResellerOrdersWithDetails = await Promise.all(recentResellerOrders.map(async (order) => {
//             const [user] = await db
//                 .select({ name: users.name, email: users.email })
//                 .from(users)
//                 .where(eq(users.id, order.userId))
//                 .limit(1);

//             const [itemStat] = await db
//                 .select({ sum: sql<number>`COALESCE(sum(${resellerOrderItems.quantity}), 0)` })
//                 .from(resellerOrderItems)
//                 .where(eq(resellerOrderItems.orderId, order.id));

//             const dateObj = order.createdAt ? new Date(order.createdAt) : new Date();
//             const formattedDate = dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
//             const formattedTime = dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

//             return {
//                 id: order.id,
//                 customer: user?.name || `Canastero #${order.userId}`,
//                 email: user?.email || '',
//                 items: Number(itemStat?.sum || 0),
//                 total: Number(order.total),
//                 date: formattedDate,
//                 time: formattedTime,
//                 status: order.status,
//                 type: 'reseller' as const,
//                 createdAt: order.createdAt
//             };
//         }));

//         const allRecentSales = [...recentAdminSalesWithCount, ...recentResellerOrdersWithDetails]
//             .sort((a, b) => {
//                 const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//                 const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//                 return dateB - dateA;
//             })
//             .slice(0, 5)
//             .map(({ createdAt, ...rest }) => rest);

//         return {
//             success: true,
//             data: {
//                 stats: {
//                     revenue: Number(adminSalesStats?.totalRevenue || 0) + Number(resellerStats?.totalRevenue || 0),
//                     orders: Number(adminSalesStats?.totalOrders || 0) + Number(resellerStats?.totalOrders || 0),
//                     products: Number(adminProductStats?.totalProducts || 0) + Number(resellerProductStats?.totalProducts || 0),
//                     revenueToday: Number(adminToday?.revenue || 0) + Number(resellerToday?.revenue || 0),
//                     productsToday: Number(adminToday?.products || 0) + Number(resellerToday?.products || 0),
//                 },
//                 topSellers: allSellers,
//                 topCustomers: topCustomers,
//                 recentSales: allRecentSales
//             }
//         };

//     } catch (error) {
//         console.error('Error fetching dashboard stats:', error);
//         return {
//             success: false,
//             error: 'Failed to fetch dashboard stats'
//         };
//     }
// });
import { useDrizzle } from '~/server/utils/drizzle';
import { sales, saleItems, resellerOrders, resellerOrderItems, users } from '~/server/db/schema';
import { sql, eq, desc, sum, count, and, ne } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    try {
        const db = useDrizzle();
        if (!db) throw new Error('DB connection failed');

        const todayStr = new Date().toISOString().split('T')[0];

        // 1. Estadísticas Globales
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

        // 2. Ventas de Hoy (SimpleDashboard)
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

        // 3. Vendedores Top (Unificado en Lógica)
        const adminSellersData = await db
            .select({
                name: sales.seller,
                sales: sql<number>`COALESCE(sum(${sales.totalPrice}), 0)`,
                orders: count(sales.id),
                products: sql<number>`COALESCE(sum(${saleItems.quantity}), 0)`
            })
            .from(sales)
            .leftJoin(saleItems, eq(sales.id, saleItems.saleId))
            .where(ne(sales.status, 'Anulada'))
            .groupBy(sales.seller)
            .orderBy(desc(sql`sum(${sales.totalPrice})`))
            .limit(5);

        const sellers = adminSellersData.map(s => ({
            id: s.name,
            name: s.name,
            sales: Number(s.sales),
            orders: Number(s.orders),
            products: Number(s.products),
            type: 'admin' as const
        }));

        // 4. LISTA UNIFICADA DE VENTAS RECIENTES (Lo que pediste)
        // Traemos 10 de cada una y luego mezclamos
        const recentAdmin = await db
            .select({
                id: sales.id,
                customer: sales.customer,
                total: sales.totalPrice,
                status: sales.status,
                createdAt: sales.createdAt,
                type: sql<string>`'Mostrador'`
            })
            .from(sales)
            .orderBy(desc(sales.createdAt))
            .limit(10);

        const recentResellers = await db
            .select({
                id: resellerOrders.id,
                customer: users.name,
                total: resellerOrders.total,
                status: resellerOrders.status,
                createdAt: resellerOrders.createdAt,
                type: sql<string>`'Canastero'`
            })
            .from(resellerOrders)
            .leftJoin(users, eq(resellerOrders.userId, users.id))
            .orderBy(desc(resellerOrders.createdAt))
            .limit(10);

        // Mezcla y formateo cronológico
        const allRecentSales = [...recentAdmin, ...recentResellers]
            .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
            .slice(0, 10)
            .map(sale => ({
                ...sale,
                total: Number(sale.total),
                date: sale.createdAt ? new Date(sale.createdAt).toLocaleDateString('es-AR') : '',
                time: sale.createdAt ? new Date(sale.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : ''
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
                topSellers: sellers,
                recentSales: allRecentSales
            }
        };

    } catch (error) {
        console.error('Dashboard Error:', error);
        return { success: false, error: 'Error al cargar estadísticas' };
    }
});