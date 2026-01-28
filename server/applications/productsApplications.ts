import { H3Event } from 'h3' // importo H3Event que sirve para tipar el event
import * as service from '../services/productsService' //importo todos los servicios

//import { products } from '@prisma/client'
import { products } from "../db/schema";
import { type InferSelectModel } from 'drizzle-orm';

type Product = InferSelectModel<typeof products>;



//buscaTodos
export const buscaTodos = async (event: H3Event): Promise<Product[] | string> => {
    const productos = await service.buscarTodos() //llamo al servicio buscarTodos

    if (!productos.length) {
        setResponseStatus(event, 404, "No se encontraron productos");

        return 'No se encontraron productos';
    }

    setResponseStatus(event, 200, "De acuerdo");

    return productos;
}
//BuscaPorId

export const buscarPorId = async (event: H3Event): Promise<Product | string> => {
    const produtoId = getRouterParam(event, 'id') || '';

    if (+produtoId < 0) {
        throw createError({
            status: 400,
            message: "Id del producto es invalido",
            statusMessage: "Error Id",
            data: {
                message: "Producto invalido"
            }
        })
    }

    const producto = await service.buscarPorId(+produtoId);

    if (!producto) {
        setResponseStatus(event, 404, "No encontrado");
        return "Producto no encontrado"
    }

    setResponseStatus(event, 200,)
    return producto;
}
//Crea
export const crear = async (event: H3Event): Promise<Product | string> => {
    const body = await readBody<Product>(event); //leo el body y lo tipifico como products

    const nuevoProducto = await service.crear(body); //llamo al servicio crear

    if (!nuevoProducto) {
        setResponseStatus(event, 500, "Error al crear el producto");
        return "Error al crear el producto";
    }

    setResponseStatus(event, 201, "Producto creado");
    return nuevoProducto;
}
//Actualiza
export const editar = async (event: H3Event): Promise<boolean | string> => {
    const body = await readBody<Product>(event); //leo el body y lo tipifico como products
    const productoId = getRouterParam(event, 'id') || '';

    const productoExistente = await service.buscarPorId(+productoId);

    if (!productoExistente) {
        setResponseStatus(event, 404, "Producto no encontrado");
        return "Producto no encontrado";
    }

    const editado = await service.editar(body); //llamo al servicio editar

    if (!editado) {
        setResponseStatus(event, 500, "Error al editar el producto");
        return "Error al editar el producto";
    }

    setResponseStatus(event, 200, "Producto editado");
    return "Producto editado";
}
//Elimina
export const eliminar = async (event: H3Event): Promise<boolean | string> => {
    const productoId = getRouterParam(event, 'id') || '';

    const productoExistente = await service.buscarPorId(+productoId);

    if (!productoExistente) {
        setResponseStatus(event, 404, "Producto no encontrado");
        return "Producto no encontrado";
    }

    const eliminado = await service.eliminar(+productoId); //llamo al servicio eliminar

    if (!eliminado) {
        setResponseStatus(event, 500, "Error al eliminar el producto");
        return "Error al eliminar el producto";
    }

    setResponseStatus(event, 200, "Producto eliminado");
    return "Producto eliminado";
}

