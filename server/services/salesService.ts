// server/services/salesService.ts
import { sales, saleItems, products } from '../db/schema';
// salesService.ts
import { useDrizzle } from '../utils/drizzle';
import { eq, and, desc, count, gte, lte, sql } from 'drizzle-orm';

const db = useDrizzle();
interface SaleQueryParams {
    page?: number;
    limit?: number;
    status?: string;
    user_id?: number;
    customer_id?: number;
    date_from?: string;
    date_to?: string;
}

interface SaleResponse {
    data: any[]; // Simplificado para coincidir con la inferencia de Drizzle, o mantener tipado estricto mapeando
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface SaleItemInput {
    product_id: number;
    quantity: number;
    unit_price: number;
}

interface SaleInput {
    customer: string;
    email?: string | null;
    seller: string;
    date: string;
    time?: string | null;
    status: string;
    customer_id?: number | null;
    user_id: number;
    sale_items: SaleItemInput[];
}

export const buscarTodosSales = async (params: SaleQueryParams = {}): Promise<SaleResponse> => {
    try {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const conditions = [];
        if (params.status) conditions.push(eq(sales.status, params.status));
        if (params.user_id) conditions.push(eq(sales.userId, params.user_id));
        if (params.customer_id) conditions.push(eq(sales.customerId, params.customer_id));
        if (params.date_from) conditions.push(gte(sales.date, params.date_from));
        if (params.date_to) conditions.push(lte(sales.date, params.date_to));

        const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

        const salesData = await db.query.sales.findMany({
            where: whereCondition,
            limit: limit,
            offset: skip,
            orderBy: [desc(sales.date)],
            with: {
                saleItems: {
                    with: {
                        product: true,
                    },
                },
                user: true,
                // customer_ref: true, // Note: Schema relation name for customer is 'customer' or 'customer_ref'?
                // relations.ts: customer: one(customers ...), export is salesRelations { customer: ... }
                customer: true,
            },
        });

        // Count total
        const [totalResult] = await db
            .select({ count: count() })
            .from(sales)
            .where(whereCondition);
        const total = totalResult ? totalResult.count : 0;

        return {
            data: salesData.map(sale => ({
                id: Number(sale.id),
                user_id: Number(sale.userId),
                customer_id: sale.customerId ? Number(sale.customerId) : null,
                customer: sale.customer,
                email: sale.email,
                seller: sale.seller,
                date: sale.date, // string or Date depending on driver, schema mode: 'string'
                time: sale.time,
                status: sale.status,
                total_price: Number(sale.totalPrice),
                created_at: sale.createdAt,
                updated_at: sale.updatedAt,
                // Adjust for relation naming
                sale_items: sale.saleItems.map(item => ({
                    id: Number(item.id),
                    sale_id: Number(item.saleId),
                    product_id: Number(item.productId),
                    product_name: item.product ? item.product.name : 'Producto Eliminado', // Safety check
                    quantity: Number(item.quantity),
                    unit_price: Number(item.unitPrice),
                    subtotal: Number(item.subtotal),
                    created_at: item.createdAt,
                    updated_at: item.updatedAt,
                })),
                user_name: sale.user ? sale.user.name : 'Usuario Desconocido',
                // customer relation might be null if not linked
                customer_name: sale.customer ? sale.customer.name : null,
            })),
            meta: {
                page,
                limit,
                total: Number(total),
                totalPages: Math.ceil(Number(total) / limit),
            },
        };
    } catch (error) {
        console.error('Error en buscarTodosSales:', error);
        throw error;
    }
    // No need to disconnect manually with connection pool typically, or handle at app level
};

export const buscarSalePorId = async (id: number): Promise<{ sale: any } | null> => {
    try {
        const sale = await db.query.sales.findFirst({
            where: eq(sales.id, id),
            with: {
                saleItems: {
                    with: {
                        product: true,
                    },
                },
                user: true,
                customer: true,
            },
        });

        if (!sale) return null;

        return {
            sale: {
                id: Number(sale.id),
                user_id: Number(sale.userId),
                customer_id: sale.customerId ? Number(sale.customerId) : null,
                customer: sale.customer,
                email: sale.email,
                seller: sale.seller,
                date: sale.date,
                time: sale.time,
                status: sale.status,
                total_price: Number(sale.totalPrice),
                created_at: sale.createdAt,
                updated_at: sale.updatedAt,
                sale_items: sale.saleItems.map(item => ({
                    id: Number(item.id),
                    sale_id: Number(item.saleId),
                    product_id: Number(item.productId),
                    product_name: item.product ? item.product.name : 'Producto Eliminado',
                    quantity: Number(item.quantity),
                    unit_price: Number(item.unitPrice),
                    subtotal: Number(item.subtotal),
                    created_at: item.createdAt,
                    updated_at: item.updatedAt,
                })),
                user_name: sale.user ? sale.user.name : 'Usuario Desconocido',
                customer_name: sale.customer ? sale.customer.name : null,
            },
        };
    } catch (error) {
        console.error('Error en buscarSalePorId:', error);
        throw error;
    }
};

export const crearSale = async (saleData: SaleInput): Promise<{ sale: any }> => {
    try {
        const { customer, email, seller, date, time, status, customer_id, user_id, sale_items } = saleData;

        if (!customer || !seller || !date || !sale_items?.length || !user_id) {
            throw new Error('Faltan campos obligatorios');
        }

        const totalPrice = sale_items.reduce((sum, item) => sum + Number(item.quantity * item.unit_price), 0);

        /// Transaction for atomicity
        // En crearSale...
        const saleId = await db.transaction(async (tx) => {
            const [insertResult] = await tx.insert(sales).values({
                customer,
                email,
                seller,
                date,
                time: time || null,
                status,
                customerId: customer_id ? Number(customer_id) : null,
                userId: Number(user_id),
                totalPrice: String(totalPrice),
            });

            // En MySQL/mysql2, el ID está en insertId
            const newSaleId = insertResult.insertId;

            if (sale_items.length > 0) {
                await tx.insert(saleItems).values(
                    sale_items.map(item => ({
                        saleId: newSaleId,
                        productId: Number(item.product_id),
                        quantity: Number(item.quantity),
                        unitPrice: String(item.unit_price),
                        subtotal: String(item.quantity * item.unit_price),
                    }))
                );
            }
            return newSaleId;
        });

        const createdSale = await buscarSalePorId(saleId);
        if (!createdSale) throw new Error('Error recuperando preventa creada');
        return createdSale;

    } catch (error) {
        console.error('Error en crearSale:', error);
        throw error;
    }
};

export const actualizarSale = async (id: number, updatedData: SaleInput): Promise<{ sale: any }> => {
    try {
        const { customer, email, seller, date, time, status, customer_id, user_id, sale_items } = updatedData;

        if (!customer || !seller || !date || !sale_items?.length || !user_id) {
            throw new Error('Faltan campos obligatorios');
        }

        const totalPrice = sale_items.reduce((sum, item) => sum + Number(item.quantity * item.unit_price), 0);

        await db.transaction(async (tx) => {
            await tx.update(sales).set({
                customer,
                email,
                seller,
                date: date,
                time: time ? time : null,
                status,
                customerId: customer_id ? Number(customer_id) : null,
                userId: Number(user_id),
                totalPrice: String(totalPrice),
            }).where(eq(sales.id, id));

            // Replace items
            await tx.delete(saleItems).where(eq(saleItems.saleId, id));

            if (sale_items.length > 0) {
                await tx.insert(saleItems).values(
                    sale_items.map(item => ({
                        saleId: id,
                        productId: Number(item.product_id),
                        quantity: Number(item.quantity),
                        unitPrice: String(item.unit_price),
                        subtotal: String(item.quantity * item.unit_price),
                    }))
                );
            }
        });

        const updatedSale = await buscarSalePorId(id);
        if (!updatedSale) throw new Error('Error recuperando venta actualizada');
        return updatedSale;

    } catch (error) {
        console.error('Error en actualizarSale:', error);
        throw error;
    }
};

export const eliminarSale = async (id: number): Promise<{ success: boolean; message: string }> => {
    try {
        const sale = await buscarSalePorId(id);

        if (!sale) {
            throw new Error('Venta no encontrada');
        }

        await db.transaction(async (tx) => {
            // Restore stock
            if (sale.sale.sale_items && sale.sale.sale_items.length > 0) {
                for (const item of sale.sale.sale_items) {
                    // Update product stock using sql increment to avoid race conditions roughly, 
                    // though simple read-modify-write in transaction is also okay for now if strict concurrency isn't a huge issue yet.
                    // But using sql increment is better.
                    // actually, drizzle doesn't have a simple increment method like prisma's { increment: x } in the update object directly without sql operator.
                    // Let's use sql template string for increment.
                    await tx.update(products)
                        .set({
                            stock: sql`${products.stock} + ${item.quantity}`
                        })
                        .where(eq(products.id, item.product_id));
                }
            }

            // Delete sale items
            await tx.delete(saleItems).where(eq(saleItems.saleId, id));

            // Delete sale
            await tx.delete(sales).where(eq(sales.id, id));
        });

        return { success: true, message: 'Venta eliminada correctamente' };
    } catch (error) {
        console.error('Error en eliminarSale:', error);
        throw error;
    }
};