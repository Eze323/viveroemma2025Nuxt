// import { query } from '../../utils/db';
// import { formatProduct } from '../../utils/formatProduct';
// import { Product, FormattedProduct } from '../../../types/product';
// import { defineEventHandler, createError } from 'h3';

// export default defineEventHandler(async () => {
//   // try {
//   //   const products = await query<Product>('SELECT * FROM products');
//   //   const formattedProducts = await Promise.all(products.map(product => formatProduct(product)));
//   //   return {
//   //     message: 'Lista de productos',
//   //     status: 'OK',
//   //     data: formattedProducts
//   //   };
//   // } catch (error) {
//   //   throw createError({
//   //     statusCode: 500,
//   //     message: 'Error al obtener productos',
//   //     data: error instanceof Error ? error.message : String(error)
//   //   });
//   // }
//   return {
//     message: 'Lista de productos',
//     status: 'OK',
//     data: []
//   };
// });