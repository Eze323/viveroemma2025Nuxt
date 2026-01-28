
//import { products } from "@prisma/client";

//import { PrismaClient } from "@prisma/client";

import { db } from "../utils/drizzle"; // O como se llame tu archivo de conexión
import { products } from "../db/schema";
import { type InferSelectModel } from 'drizzle-orm';

type Product = InferSelectModel<typeof products>;

export const buscaTodos = async () => {
    return await db.select().from(products);
};

// Asegúrate de que TODAS tengan el "export const"
//export const buscarPorId = async (id: number) => { ... };
//export const crear = async (data: any) => { ... };


// const prisma = new PrismaClient();
const prisma: any = {}; // Prisma disabled for debugging




export const buscarTodos = async (): Promise<Product[]> => {

    return await prisma.products.findMany();

}

//BuscaPorId
export const buscarPorId = async (id: number): Promise<Product | null> => {

    return await prisma.products.findFirst({
        where: { id },
    })
};

//Crea
export const crear = async (producto: Product): Promise<Product | undefined> => {

    const productoCreado = await prisma.products.create({
        data: producto
    })

    if (productoCreado) {
        return productoCreado
    }

    return undefined;

}

export const editar = async (product: Product): Promise<boolean> => {
    const productoEditado = await prisma.products.update({
        where: { id: product.id },
        data: product
    })

    return !!productoEditado;
}


//Eliminar
export const eliminar = async (id: number): Promise<boolean> => {
    const productoEliminado = await prisma.products.delete({
        where: { id: id },

    })

    return productoEliminado !== null;
}




