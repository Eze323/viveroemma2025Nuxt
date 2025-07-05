// types/product.ts
export interface Product {
  id: number;
  name: string;
  category: 'planta' | 'arbusto' | 'plantin' | 'otro' | 'semilla' | 'herramienta' | null; 
  description?: string; // Descripción opcional
  price: string; // Precio de costo (string por Drizzle)
  stock: number;
  image_url: string | null;
  pot_size: string | null;
}

export interface FormattedProduct {
  id: number;
  name: string;
  category: 'planta' | 'arbusto' | 'plantin' | 'otro' | 'semilla' | 'herramienta' | null; 
  description: string; // Descripción del producto
  price: string; // Precio de venta
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