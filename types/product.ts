import type { Decimal } from "@prisma/client/runtime/library";

// types/product.ts
export interface Product {
  id: number;
  name: string;
  category: string | null; //'planta' | 'arbusto' | 'plantin' | 'otro' | 'semilla' | 'herramienta' | null; 
  description?: string | null; // Descripción opcional
  precio_venta: number | Decimal; // Precio de costo (string por Drizzle)
  precio_compra: number | Decimal; // Precio de venta (número por Drizzle)
  publicado: boolean; // Indica si el producto está publicado
  sku: string | null; // SKU del producto
  stock: number;
  image_url: string | null;
  pot_size: string | null;
}

export interface FormattedProduct {
  id: number;
  name: string;
  category: string | null; //'planta' | 'arbusto' | 'plantin' | 'otro' | 'semilla' | 'herramienta' | null; 
  description?: string | null; // Descripción del producto
  precio_compra: string | Decimal; // Precio de costo
  precio_venta: string | Decimal; // Precio de venta
  publicado: boolean; // Indica si el producto está publicado
  sku: string | null; // SKU del producto
  cost_price: number; // Precio de costo
  stock: number;
  image_url: string | null;
  pot_size: string | null;
}

export interface User{
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  
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
