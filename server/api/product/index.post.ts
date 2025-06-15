// import { query } from '../../utils/db';
// import { formatProduct } from '../../utils/formatProduct';
// import { Product, ProductInput, FormattedProduct } from '../../../types/product';

// export default defineEventHandler({
//   //middleware: ['auth'],
//   handler: async (event) => {
//     const body = await readBody<ProductInput>(event);
//     const { name, category, price, cost_price, stock, pot_size, image_url } = body;

//     if (!name || !category || !price || !cost_price || stock === undefined) {
//       throw createError({
//         statusCode: 400,
//         message: 'Faltan campos obligatorios: name, category, price, cost_price, stock'
//       });
//     }
//     if (!['planta', 'arbusto', 'plantin', 'otro', 'semilla', 'herramienta'].includes(category)) {
//       throw createError({
//         statusCode: 400,
//         message: 'Categoría inválida'
//       });
//     }
//     if (pot_size && !['pequeña', 'mediana', 'grande'].includes(pot_size)) {
//       throw createError({
//         statusCode: 400,
//         message: 'Tamaño de maceta inválido'
//       });
//     }
//     if (image_url && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(image_url)) {
//       throw createError({
//         statusCode: 400,
//         message: 'URL de imagen inválida'
//       });
//     }

//     try {
//       const [result] = await query(
//         'INSERT INTO products (name, category, price, stock, pot_size, image_url) VALUES (?, ?, ?, ?, ?, ?)',
//         [name, category, cost_price, stock, pot_size, image_url]
//       );
//       const [product] = await query<Product>('SELECT * FROM products WHERE id = ?', [result.insertId]);

//       if (pot_size) {
//         await query(
//           'INSERT INTO plant_pot_prices (product_id, pot_size, price) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE price = ?',
//           [product.id, pot_size, price, price]
//         );
//       }

//       const formattedProduct = await formatProduct(product);
//       return {
//         message: 'Producto creado',
//         status: 'OK',
//         data: formattedProduct
//       };
//     } catch (error) {
//       throw createError({
//         statusCode: 500,
//         message: 'Error al crear producto',
//         data: error instanceof Error ? error.message : String(error)
//       });
//     }
//   }
// });