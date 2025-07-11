// types/product.ts
export interface Product {
  id: number;
  name: string;
  category: 'planta' | 'arbusto' | 'plantin' | 'otro' | 'semilla' | 'herramienta' | null; 
  description?: string; // Descripción opcional
  precio_venta: number; // Precio de costo (string por Drizzle)
  precio_compra: number; // Precio de venta (número por Drizzle)
  publicado: boolean; // Indica si el producto está publicado
  sku: string | null; // SKU del producto
  stock: number;
  image_url: string | null;
  pot_size: string | null;
}

export interface FormattedProduct {
  id: number;
  name: string;
  category: 'planta' | 'arbusto' | 'plantin' | 'otro' | 'semilla' | 'herramienta' | null; 
  description: string; // Descripción del producto
  precio_compra: string; // Precio de costo
  precio_venta: string; // Precio de venta
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