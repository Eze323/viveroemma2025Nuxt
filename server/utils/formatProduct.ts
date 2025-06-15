import { Product, FormattedProduct, SupplierPrice, Purchase, PlantPotPrice } from '../../types/product';
import { query } from './db';

export async function formatProduct(product: Product): Promise<FormattedProduct> {
  const [potPrice] = await query<PlantPotPrice>('SELECT price FROM plant_pot_prices WHERE product_id = ? AND pot_size = ?', [product.id, product.pot_size]);
  const finalPrice = potPrice ? parseFloat(potPrice.price.toString()) : parseFloat(product.price.toString());

  const supplierPrices = await query<SupplierPrice & { supplier_name?: string }>(
    'SELECT sp.*, s.name as supplier_name FROM supplier_prices sp LEFT JOIN suppliers s ON sp.supplier_id = s.id WHERE sp.product_id = ?',
    [product.id]
  );

  const purchases = await query<Purchase & { supplier_name?: string }>(
    'SELECT p.*, s.name as supplier_name FROM purchases p LEFT JOIN suppliers s ON p.supplier_id = s.id WHERE p.product_id = ?',
    [product.id]
  );

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: finalPrice,
    cost_price: parseFloat(product.price.toString()),
    stock: product.stock,
    image_url: product.image_url,
    pot_size: product.pot_size,
    supplier_prices: supplierPrices.map(sp => ({
      id: sp.id,
      product_id: sp.product_id,
      supplier_id: sp.supplier_id,
      supplier_name: sp.supplier_name || 'Unknown',
      purchase_price: parseFloat(sp.purchase_price.toString()),
      valid_from: sp.valid_from,
      valid_to: sp.valid_to
    })),
    purchases: purchases.map(p => ({
      id: p.id,
      product_id: p.product_id,
      supplier_id: p.supplier_id,
      supplier_name: p.supplier_name || 'Unknown',
      quantity: p.quantity,
      purchase_price: parseFloat(p.purchase_price.toString()),
      purchase_date: p.purchase_date
    }))
  };
}