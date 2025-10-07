
import { products } from "@prisma/client";

import { PrismaClient } from "~/src/generated/prisma";


const prisma = new PrismaClient();




export const buscarTodos = async (): Promise<products[]> => {
    
    return await prisma.products.findMany();

}

//BuscaPorId
export const buscarPorId = async (id:number): Promise<products | null> => {
    
    return await prisma.products.findFirst({
        where: { id},
    })
};

//Crea
export const crear = async (producto:products): Promise<products | undefined> => {
    
    const productoCreado = await prisma.products.create({
        data: producto
    })

    if(productoCreado){
        return productoCreado
    }

    return undefined;
    
}

export const editar = async (product: products): Promise<boolean> =>{
    const productoEditado = await prisma.products.update({
        where: {id: product.id},
        data:product
    })

    return !!productoEditado;
}


//Eliminar
export const eliminar = async (id: number): Promise<boolean>  => {
    const productoEliminado = await prisma.products.delete({
        where:{id:id},

    })

    return productoEliminado !== null;
}


