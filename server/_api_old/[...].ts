import * as productsApplication from "../applications/productsApplications"
import * as salesApplication from "../applications/salesApplications"
const router = createRouter() //crea la instancia del router

router.get('/product', defineEventHandler(productsApplication.buscaTodos) ) //asigna la ruta y la funcion  buscarTodos
router.get('/product/:id', defineEventHandler(productsApplication.buscarPorId) ) //asigna la ruta y la funcion  buscarTodos
router.post('/product', defineEventHandler(productsApplication.crear) ) //asigna la ruta y la funcion  crear
router.put('/product/:id', defineEventHandler(productsApplication.editar) ) //asigna la ruta y la funcion  actualizar
router.delete('/product/:id', defineEventHandler(productsApplication.eliminar) ) //asigna la ruta y la funcion  eliminar

//Rutas de ventas y items de venta
router.get('/sales', defineEventHandler(salesApplication.buscaTodos) ) //asigna la ruta y la funcion  buscarTodos
//  router.get('/sales/:id', defineEventHandler(salesApplication.buscarPorId) ) //asigna la ruta y la funcion  buscarTodos
//  router.post('/sales', defineEventHandler(salesApplication.crear) ) //asigna la ruta y la funcion  crear
//  router.put('/sales/:id', defineEventHandler(salesApplication.actualizar) ) //asigna la ruta y la funcion  actualizar
//  router.delete('/sales/:id', defineEventHandler(salesApplication.eliminar) ) //asigna la ruta y la funcion  eliminar


export default useBase('/api/v1', router.handler) //asigna la base del router