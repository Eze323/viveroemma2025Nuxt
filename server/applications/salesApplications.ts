import { H3Event } from 'h3' // importo H3Event que sirve para tipar el event
import * as service from '../services/salesService' //importo todos los servicios
import { sales } from '@prisma/client'





//buscaTodos Sales
export const buscaTodos = async (event: H3Event):Promise<sales[] | string> => {
    const ventas = await service.buscarTodosSales() //llamo al servicio buscarTodos

    if (!Array.isArray(ventas) || ventas.length === 0) {
        setResponseStatus(event, 404,"No se encontraron ventas");

        return 'No se encontraron ventas';
    }

    setResponseStatus(event, 200,"De acuerdo");
    
    // Devuelve las ventas tal como están, manteniendo user_id como bigint
    return ventas;
}

