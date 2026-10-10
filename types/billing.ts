// types/billing.ts
// Tipos y constantes para Facturación Electrónica ARCA / AFIP (Argentina)

export enum InvoiceTypeEnum {
  FACTURA_A = 1,
  FACTURA_B = 6,
  FACTURA_C = 11,
  TICKET_PRESUPUESTO = 99,
}

export const INVOICE_TYPE_OPTIONS = [
  { value: 99, label: 'Ticket / Presupuesto (Uso Interno)', code: 'TIK', badgeColor: 'gray' },
  { value: 6, label: 'Factura B (Consumidor Final / Exento)', code: 'FB', badgeColor: 'blue' },
  { value: 1, label: 'Factura A (Responsable Inscripto)', code: 'FA', badgeColor: 'purple' },
  { value: 11, label: 'Factura C (Monotributo / Otros)', code: 'FC', badgeColor: 'emerald' },
] as const;

export type InvoiceTypeValue = 1 | 6 | 11 | 99;

export enum DocTypeEnum {
  CUIT = 80,
  CUIL = 86,
  DNI = 96,
  CONSUMIDOR_FINAL = 99,
}

export const DOC_TYPE_OPTIONS = [
  { value: 99, label: 'Consumidor Final (Sin Documento)' },
  { value: 96, label: 'DNI (Documento Nacional)' },
  { value: 80, label: 'CUIT (Clave Única Tributaria)' },
  { value: 86, label: 'CUIL (Código Único Laboral)' },
] as const;

export type DocTypeValue = 80 | 86 | 96 | 99;

export const IVA_CONDITIONS = [
  'Consumidor Final',
  'Responsable Inscripto',
  'Monotributo',
  'Exento',
  'No Responsable',
] as const;

export type IvaConditionType = typeof IVA_CONDITIONS[number];

export const IVA_RATES = [
  { value: 0.21, label: 'IVA 21% (Tasa Estándar)' },
  { value: 0.105, label: 'IVA 10.5% (Plantas vivas / Insumos agropecuarios)' },
  { value: 0.0, label: 'IVA 0% (Exento / No Gravado)' },
] as const;

export type BillingStatusType = 'unbilled' | 'pending' | 'billed' | 'error';

export const BILLING_STATUS_CONFIG: Record<BillingStatusType, { label: string; color: string; icon: string }> = {
  unbilled: { label: 'Sin Facturar', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: 'heroicons:document' },
  pending: { label: 'Pendiente ARCA', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'heroicons:clock' },
  billed: { label: 'Facturado (CAE)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'heroicons:check-badge' },
  error: { label: 'Error ARCA', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: 'heroicons:exclamation-circle' },
};
