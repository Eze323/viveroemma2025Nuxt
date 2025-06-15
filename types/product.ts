// types/product.ts

export interface Product {
  id: number;
  name: string;
  category: 'planta' | 'arbusto' | 'plantin' | 'otro' | 'semilla' | 'herramienta';
  price: number; // Precio de costo
  stock: number;
  pot_size: 'pequeña' | 'mediana' | 'grande' | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlantPotPrice {
  id: number;
  product_id: number;
  pot_size: 'pequeña' | 'mediana' | 'grande';
  price: number; // Precio de venta
}

export interface SupplierPrice {
  id: number;
  product_id: number;
  supplier_id: number;
  supplier_name: string | null;
  purchase_price: number;
  valid_from: string;
  valid_to: string | null;
}

export interface Purchase {
  id: number;
  product_id: number;
  supplier_id: number;
  supplier_name: string | null;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
}

export interface FormattedProduct {
  id: number;
  name: string;
  category: 'planta' | 'arbusto' | 'plantin' | 'otro' | 'semilla' | 'herramienta';
  price: number; // Precio de venta (final_price)
  cost_price: number; // Precio de costo
  stock: number;
  image_url: string | null;
  pot_size: 'pequeña' | 'mediana' | 'grande' | null;
  supplier_prices: SupplierPrice[];
  purchases: Purchase[];
}

export interface ProductInput {
  name: string;
  category: 'planta' | 'arbusto' | 'plantin' | 'otro' | 'semilla' | 'herramienta';
  price: number; // Precio de venta
  cost_price: number; // Precio de costo
  stock: number;
  pot_size?: 'pequeña' | 'mediana' | 'grande' | null;
  image_url?: string | null;
}

