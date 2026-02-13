
//import { products } from "@prisma/client";

//import { PrismaClient } from "@prisma/client";

import { useDrizzle } from "../utils/drizzle"; // O como se llame tu archivo de conexión
import { products, sales, saleItems } from "../db/schema";
import { eq } from "drizzle-orm";
import { type InferSelectModel } from 'drizzle-orm';

const db = useDrizzle();
type Product = InferSelectModel<typeof products>;

export const buscaTodos = async () => {
    return await db.select().from(products);
};

// Asegúrate de que TODAS tengan el "export const"
//export const buscarPorId = async (id: number) => { ... };
//export const crear = async (data: any) => { ... };


// const prisma = new PrismaClient();
//const prisma: any = {}; // Prisma disabled for debugging




export const buscarTodos = async (): Promise<Product[]> => {

    return await db.select().from(products);

}

//BuscaPorId
export const buscarPorId = async (id: number): Promise<Product | null> => {

    return await db.select().from(products).where(eq(products.id, id));
};

//Crea
export const crear = async (producto: Product): Promise<Product | undefined> => {

    const productoCreado = await db.insert(products).values(producto);

    if (productoCreado) {
        return productoCreado
    }

    return undefined;

}

export const editar = async (product: Product): Promise<boolean> => {
    const productoEditado = await db.update(products).set(product).where(eq(products.id, product.id));

    return !!productoEditado;
}


//Eliminar
export const eliminar = async (id: number): Promise<boolean> => {
    const productoEliminado = await db.delete(products).where(eq(products.id, id));

    return !!productoEliminado;
}




