// types/customer.ts
import type { IvaConditionType } from './billing';

export interface Customer {
  id?: number;
  name: string;
  email?: string | null;
  address?: string | null;
  phone?: string | null;
  taxId?: string | null;
  ivaCondition?: IvaConditionType | string | null;
  fiscalAddress?: string | null;
}

export interface CustomerInput {
  name: string;
  email?: string | null;
  address?: string | null;
  phone?: string | null;
  taxId?: string | null;
  ivaCondition?: string | null;
  fiscalAddress?: string | null;
}
