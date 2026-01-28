
import { H3Event } from 'h3'
import * as service from '../services/salesService'
//import { Sale } from '../utils/drizzle'
import type { Sale } from '../utils/drizzle'

//buscaTodos Sales
export const buscaTodos = async (event: H3Event): Promise<Sale[] | string> => {
    const response = await service.buscarTodosSales()

    // The service returns { data: Sale[], meta: ... }
    const ventas = response.data;

    if (!Array.isArray(ventas) || ventas.length === 0) {
        setResponseStatus(event, 404, "No se encontraron ventas");
        return 'No se encontraron ventas';
    }

    setResponseStatus(event, 200, "De acuerdo");


    // Devuelve las ventas tal como están
    return ventas;
}

export const eliminar = async (event: H3Event): Promise<any> => {
    const id = getRouterParam(event, 'id');
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID de venta requerido',
        });
    }

    try {
        const result = await service.eliminarSale(Number(id));
        return result;
    } catch (error: any) {
        if (error.message === 'Venta no encontrada') {
            throw createError({
                statusCode: 404,
                statusMessage: 'Venta no encontrada',
            });
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al eliminar la venta',
        });
    }
}
