// server/services/salesService.ts
import { PrismaClient, sales } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

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
  data: {
    id: number;
    user_id: number;
    customer_id: number | null;
    customer: string;
    email: string | null;
    seller: string;
    date: Date;
    time: Date | null;
    status: string;
    total_price: number;
    created_at: Date | null;
    updated_at: Date | null;
    sale_items: {
      id: number;
      sale_id: number;
      product_id: number;
      product_name: string;
      quantity: number;
      unit_price: number;
      subtotal: number;
      created_at: Date | null;
      updated_at: Date | null;
    }[];
    user_name: string;
    customer_name: string | null;
  }[];
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

    const where: any = {};
    if (params.status) where.status = params.status;
    if (params.user_id) where.user_id = Number(params.user_id);
    if (params.customer_id) where.customer_id = Number(params.customer_id);
    if (params.date_from || params.date_to) {
      where.date = {};
      if (params.date_from) where.date.gte = new Date(params.date_from);
      if (params.date_to) where.date.lte = new Date(params.date_to);
    }

    const [salesData, total] = await Promise.all([
      prisma.sales.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          sale_items: {
            include: {
              product: true,
            },
          },
          user: true,
          customer_ref: true,
        },
      }),
      prisma.sales.count({ where }),
    ]);

    console.log('Raw sales data:', JSON.stringify(salesData, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return {
      data: salesData.map(sale => ({
        id: Number(sale.id),
        user_id: Number(sale.user_id),
        customer_id: sale.customer_id ? Number(sale.customer_id) : null,
        customer: sale.customer,
        email: sale.email,
        seller: sale.seller,
        date: sale.date,
        time: sale.time,
        status: sale.status,
        total_price: Number(sale.total_price),
        created_at: sale.created_at,
        updated_at: sale.updated_at,
        sale_items: sale.sale_items.map(item => ({
          id: Number(item.id),
          sale_id: Number(item.sale_id),
          product_id: Number(item.product_id),
          product_name: item.product.name,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          subtotal: Number(item.subtotal),
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
        user_name: sale.user.name,
        customer_name: sale.customer_ref?.name || null,
      })),
      meta: {
        page,
        limit,
        total: Number(total),
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error en buscarTodosSales:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const buscarSalePorId = async (id: number): Promise<{ sale: any } | null> => {
  try {
    const sale = await prisma.sales.findUnique({
      where: { id },
      include: {
        sale_items: {
          include: {
            product: true,
          },
        },
        user: true,
        customer_ref: true,
      },
    });

    if (!sale) return null;

    return {
      sale: {
        id: Number(sale.id),
        user_id: Number(sale.user_id),
        customer_id: sale.customer_id ? Number(sale.customer_id) : null,
        customer: sale.customer,
        email: sale.email,
        seller: sale.seller,
        date: sale.date,
        time: sale.time,
        status: sale.status,
        total_price: Number(sale.total_price),
        created_at: sale.created_at,
        updated_at: sale.updated_at,
        sale_items: sale.sale_items.map(item => ({
          id: Number(item.id),
          sale_id: Number(item.sale_id),
          product_id: Number(item.product_id),
          product_name: item.product.name,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          subtotal: Number(item.subtotal),
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
        user_name: sale.user.name,
        customer_name: sale.customer_ref?.name || null,
      },
    };
  } catch (error) {
    console.error('Error en buscarSalePorId:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const crearSale = async (saleData: SaleInput): Promise<{ sale: any }> => {
  try {
    const { customer, email, seller, date, time, status, customer_id, user_id, sale_items } = saleData;

    if (!customer || !seller || !date || !sale_items?.length || !user_id) {
      throw new Error('Faltan campos obligatorios');
    }

    const sale = await prisma.sales.create({
      data: {
        customer,
        email,
        seller,
        date: new Date(date),
        time: time ? new Date(`1970-01-01T${time}`) : null,
        status,
        customer_id: customer_id ? Number(customer_id) : null,
        user_id: Number(user_id),
        total_price: sale_items.reduce((sum, item) => sum + Number(item.quantity * item.unit_price), 0),
        sale_items: {
          create: sale_items.map(item => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
            subtotal: Number(item.quantity * item.unit_price),
          })),
        },
      },
      include: {
        sale_items: { include: { product: true } },
        user: true,
        customer_ref: true,
      },
    });

    return {
      sale: {
        id: Number(sale.id),
        user_id: Number(sale.user_id),
        customer_id: sale.customer_id ? Number(sale.customer_id) : null,
        customer: sale.customer,
        email: sale.email,
        seller: sale.seller,
        date: sale.date,
        time: sale.time,
        status: sale.status,
        total_price: Number(sale.total_price),
        created_at: sale.created_at,
        updated_at: sale.updated_at,
        sale_items: sale.sale_items.map(item => ({
          id: Number(item.id),
          sale_id: Number(item.sale_id),
          product_id: Number(item.product_id),
          product_name: item.product.name,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          subtotal: Number(item.subtotal),
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
        user_name: sale.user.name,
        customer_name: sale.customer_ref?.name || null,
      },
    };
  } catch (error) {
    console.error('Error en crearSale:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const actualizarSale = async (id: number, updatedData: SaleInput): Promise<{ sale: any }> => {
  try {
    const { customer, email, seller, date, time, status, customer_id, user_id, sale_items } = updatedData;

    if (!customer || !seller || !date || !sale_items?.length || !user_id) {
      throw new Error('Faltan campos obligatorios');
    }

    const sale = await prisma.sales.update({
      where: { id },
      data: {
        customer,
        email,
        seller,
        date: new Date(date),
        time: time ? new Date(`1970-01-01T${time}`) : null,
        status,
        customer_id: customer_id ? Number(customer_id) : null,
        user_id: Number(user_id),
        total_price: sale_items.reduce((sum, item) => sum + Number(item.quantity * item.unit_price), 0),
        sale_items: {
          deleteMany: {},
          create: sale_items.map(item => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
            subtotal: Number(item.quantity * item.unit_price),
          })),
        },
      },
      include: {
        sale_items: { include: { product: true } },
        user: true,
        customer_ref: true,
      },
    });

    return {
      sale: {
        id: Number(sale.id),
        user_id: Number(sale.user_id),
        customer_id: sale.customer_id ? Number(sale.customer_id) : null,
        customer: sale.customer,
        email: sale.email,
        seller: sale.seller,
        date: sale.date,
        time: sale.time,
        status: sale.status,
        total_price: Number(sale.total_price),
        created_at: sale.created_at,
        updated_at: sale.updated_at,
        sale_items: sale.sale_items.map(item => ({
          id: Number(item.id),
          sale_id: Number(item.sale_id),
          product_id: Number(item.product_id),
          product_name: item.product.name,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          subtotal: Number(item.subtotal),
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
        user_name: sale.user.name,
        customer_name: sale.customer_ref?.name || null,
      },
    };
  } catch (error) {
    console.error('Error en actualizarSale:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const eliminarSale = async (id: number): Promise<{ success: boolean }> => {
  try {
    await prisma.sales.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error('Error en eliminarSale:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};