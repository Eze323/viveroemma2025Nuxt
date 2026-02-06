import type { Decimal } from "@prisma/client/runtime/library";

// types/product.ts
export interface Product {
  id: number;
  name: string;
  category: string;
  description: string | null;
  precio_venta: number;
  precio_compra: number;
  precio_cantidad: number;
  publicado: boolean;
  sku: string | null;
  stock: number;
  stock_minimo: number;
  image_url: string | null;
  pot_size: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FormattedProduct {
  id: number;
  name: string;
  category: string | null;
  description: string; // Descripción del producto
  precio_compra: number; // Precio de costo
  precio_venta: number; // Precio de venta
  precio_cantidad: number; // Precio por cantidad
  publicado: boolean; // Indica si el producto está publicado
  sku: string | null; // SKU del producto
  cost_price: number; // Precio de costo
  stock: number;
  stock_minimo: number;
  image_url: string | null;
  pot_size: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  points: number;

}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface Sales {
  id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  sale_date: Date;
}
