// import { query } from '../../utils/db';
// import { Product } from '../../../types/product';

// export default defineEventHandler({
//  // middleware: ['auth'],
//   handler: async (event) => {
//     const id = getRouterParam(event, 'id');

//     try {
//       const [product] = await query<Product>('SELECT * FROM products WHERE id = ?', [id]);
//       if (!product) {
//         throw createError({
//           statusCode: 404,
//           message: 'Producto no encontrado'
//         });
//       }

//       await query('DELETE FROM products WHERE id = ?', [id]);
//       return {
//         message: 'Producto eliminado',
//         status: 'OK'
//       };
//     } catch (error: unknown) {
//       throw createError({
//         statusCode: 500,
//         message: 'Error al eliminar producto',
//         data: error instanceof Error ? error.message : 'Error desconocido'
//       });
//     }
//   }
// });