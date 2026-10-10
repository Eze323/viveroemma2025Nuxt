// types/sales.ts
import type { Customer } from './customer';
import type { Product } from './product';
import type { InvoiceTypeValue, DocTypeValue, BillingStatusType } from './billing';

export interface SaleItem {
  id?: number;
  sale_id?: number;
  productId?: number;
  product_id?: number;
  quantity: number;
  unitPrice?: number;
  unit_price?: number;
  product?: Partial<Product>;
  subtotal?: number;
}

export interface Sale {
  id: number;
  userId: number;
  customerId?: number | null;
  customer: string;
  email?: string | null;
  seller: string;
  date: string | Date;
  time?: string | null;
  status: string;
  totalPrice: number | string;
  total_price?: number;

  // Campos para Facturación Electrónica (ARCA / AFIP)
  invoiceType?: InvoiceTypeValue | null;
  pointOfSale?: number | null;
  invoiceNumber?: number | null;
  customerIvaCondition?: string | null;
  docType?: DocTypeValue | null;
  docNumber?: string | null;
  netAmount?: number | string | null;
  vatAmount?: number | string | null;
  cae?: string | null;
  caeExpiration?: string | Date | null;
  billingStatus?: BillingStatusType;

  // Relaciones
  items?: SaleItem[];
  sale_items?: SaleItem[];
  customer_ref?: Customer;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface SaleCreateInput {
  customerId?: number | null;
  customer: string;
  clientName?: string;
  email?: string | null;
  address?: string | null;
  clientAddress?: string | null;
  items: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal?: number;
  iva?: number;
  total?: number;

  // Datos fiscales ARCA
  invoiceType?: number;
  pointOfSale?: number;
  invoiceNumber?: number | null;
  customerIvaCondition?: string;
  docType?: number;
  docNumber?: string;
  netAmount?: number;
  vatAmount?: number;
  billingStatus?: BillingStatusType;
}
