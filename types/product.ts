// types/product.ts
export interface Product {
  id: number;
  name: string;
  category: string;
  description?: string; // Descripción opcional
  price: string; // Precio de costo (string por Drizzle)
  stock: number;
  image_url: string | null;
  pot_size: string | null;
}

export interface FormattedProduct {
  id: number;
  name: string;
  category: string;
  description: string; // Descripción del producto
  price: number; // Precio de venta
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