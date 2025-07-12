// server/utils/formatProduct.ts
import { db } from '~/server/utils/drizzle';
import { plantPotPrices } from '~/src/db/schema';
import { eq } from 'drizzle-orm';

export async function formatProduct(product: Product): Promise<FormattedProduct> {
  try {
    console.log('Formatting product:', product.id); // Log para depurar

    // Obtener el precio de venta desde plant_pot_prices
    const [potPrice] = await db
      .select({ price: plantPotPrices.price })
      .from(plantPotPrices)
      .where(eq(plantPotPrices.product_id, product.id))
      .limit(1);
    console.log('Pot price:', potPrice); // Log para depurar

    // Calcular el precio final
    const finalPrice = potPrice ? parseFloat(potPrice.price) : parseFloat(product.price);

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description || '', // Asegurarse de que la descripción no sea undefined
      precio_venta: parseFloat(product.precio_venta), // Precio de venta
      precio_compra: parseFloat(product.precio_compra), // Precio de costo
      publicado: product.publicado || true, // Asegurarse de que el campo publicado tenga un valor
      sku: product.sku || null, // Asegurarse de que el SKU no
      stock: product.stock,
      image_url: product.image_url,
      pot_size: product.pot_size,
    };
  } catch (error) {
    console.error('Error formatting product:', error);
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description || '', // Asegurarse de que la descripción no sea undefined
      precio_venta: parseFloat(product.precio_venta) || 0, // Precio de venta
      precio_compra: parseFloat(product.precio_compra) || 0, // Precio de costo
      publicado: product.publicado || true, // Asegurarse de que el campo publicado tenga un valor
      sku: product.sku || null, // Asegurarse de que
      
      stock: product.stock || 0,
      image_url: product.image_url,
      pot_size: product.pot_size,
    };
  }
}