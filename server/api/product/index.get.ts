import { defineEventHandler } from 'h3';

export default defineEventHandler(async () => {
  console.log('Returning static response');
  return {
    success: true,
    data: [{ id: 1, name: 'Test Product', precio_venta: 10.99, stock: 100 }],
  };
});