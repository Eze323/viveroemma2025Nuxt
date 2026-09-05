# Documentación de la API - Vivero Emma

Guía técnica completa y especificación de endpoints de la API de Vivero Emma.

---

## 1. Información General

- **URL Base:** `/api` (en producción proxied a `https://inventario-fabrica-backend.onrender.com/api`)
- **Formato de Intercambio:** `JSON` (Content-Type: `application/json`)
- **Estructura Estándar de Respuesta:**
```json
{
  "success": true,
  "data": {},
  "error": null
}
```

---

## 2. Autenticación (JWT)

La mayoría de las operaciones administrativas requieren autenticación mediante **JSON Web Token (JWT)**.

Debes enviar el token en la cabecera HTTP `Authorization`:
```http
Authorization: Bearer <tu_token_jwt>
```

### Endpoints de Autenticación

#### `POST /api/auth/login`
Inicia sesión en el sistema y retorna el token de acceso.
- **Acceso:** Público
- **Cuerpo (Body):**
```json
{
  "email": "admin@viveroemma.com",
  "password": "tu_password_segura"
}
```
- **Respuesta (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "user": {
    "id": 1,
    "name": "Romy",
    "email": "admin@viveroemma.com",
    "role": "admin"
  }
}
```

#### `GET /api/auth/user`
Obtiene los datos del usuario autenticado actual.
- **Acceso:** Privado (`Bearer Token`)
- **Respuesta (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Romy",
    "email": "admin@viveroemma.com",
    "role": "admin"
  }
}
```

#### `POST /api/auth/logout`
Cierra la sesión y revoca el token actual.
- **Acceso:** Privado (`Bearer Token`)

---

## 3. Módulo de Productos (Plantas y Artículos)

Permite consultar el catálogo tanto para la tienda pública como para el panel de administración.

### `GET /api/products`
Obtiene la lista de productos disponibles.
- **Acceso:** Público / Privado
- **Parámetros de consulta (Query Params):**
  - `category` *(opcional)*: Filtra por categoría (ej. `Plantas de interior`, `Flores`, `Herramientas`).
  - `search` *(opcional)*: Término de búsqueda por nombre común o científico.
- **Respuesta (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Monstera Deliciosa",
      "scientific_name": "Monstera deliciosa Liebm.",
      "category": "Plantas de interior",
      "precio_venta": 13000,
      "precio_costo": 8000,
      "stock": 15,
      "image_url": "https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg",
      "watering_level": 2,
      "watering_label": "Riego moderado",
      "light_type": "partial",
      "temp_range": "18° - 27° C"
    }
  ]
}
```

### `GET /api/products/:id`
Obtiene el detalle de un producto específico.
- **Acceso:** Público / Privado
- **Parámetro URL:** `id` (Número o String del producto)
- **Respuesta (200 OK):** Detalle del producto solicitado.

### `POST /api/products`
Crea un nuevo producto en el catálogo.
- **Acceso:** Privado (`Bearer Token`)
- **Cuerpo (Body):**
```json
{
  "name": "Sansevieria Trifasciata",
  "scientific_name": "Sansevieria trifasciata",
  "category": "Plantas de interior",
  "precio_venta": 8500,
  "precio_costo": 4500,
  "stock": 20,
  "image_url": "https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg",
  "watering_level": 1,
  "watering_label": "Poco riego",
  "light_type": "low",
  "temp_range": "15° - 30° C"
}
```
- **Respuesta (201 Created):**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "product": { "id": 42, "name": "Sansevieria Trifasciata", ... }
}
```

### `PUT /api/products/:id`
Actualiza datos de un producto existente (precio, stock, imagen, cuidados).
- **Acceso:** Privado (`Bearer Token`)
- **Cuerpo (Body):** Campos a actualizar (parcial o completo).
- **Respuesta (200 OK):** Objeto del producto actualizado.

### `DELETE /api/products/:id`
Elimina un producto del catálogo.
- **Acceso:** Privado (`Bearer Token`)
- **Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

---

## 4. Módulo de Ventas y Presupuestos

Control de ventas registradas en el local y pedidos de clientes.

### `GET /api/sales`
Lista el historial de ventas registradas con sus ítems asociados.
- **Acceso:** Privado (`Bearer Token`)
- **Respuesta (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 105,
      "customer": "María López",
      "seller": "Romy",
      "date": "2026-09-04",
      "status": "Completada",
      "total": 21500,
      "sale_items": [
        {
          "product_id": 1,
          "quantity": 1,
          "unit_price": 13000
        },
        {
          "product_id": 2,
          "quantity": 1,
          "unit_price": 8500
        }
      ]
    }
  ]
}
```

### `POST /api/sales`
Registra una nueva venta con sus artículos correspondientes.
- **Acceso:** Privado (`Bearer Token`)
- **Cuerpo (Body):**
```json
{
  "customer": "Juan Pérez",
  "email": "juan@example.com",
  "seller": "Romy",
  "date": "2026-09-05",
  "status": "Pendiente",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 13000
    }
  ]
}
```
- **Respuesta (201 Created):**
```json
{
  "success": true,
  "message": "Venta creada exitosamente!",
  "sale": { "id": 106, ... }
}
```

---

## 5. Módulo de Categorías

### `GET /api/categories`
Obtiene las categorías activas para clasificar las plantas y artículos.
- **Categorías principales:**
  - `Plantas de interior`
  - `Plantas de exterior`
  - `Flores`
  - `Árboles y Arbustos`
  - `Herramientas y Accesorios`
  - `Sustratos y Abonos`
  - `Macetas`

---

## 6. Subida de Imágenes (ImgBB)

### `POST /api/upload/imgbb`
Sube una imagen al servicio en la nube de ImgBB para obtener su URL pública optimizada.
- **Acceso:** Privado (`Bearer Token`)
- **Formato:** `multipart/form-data` con el archivo `image`.
- **Respuesta (200 OK):**
```json
{
  "success": true,
  "data": {
    "url": "https://i.ibb.co/example/planta.jpg",
    "display_url": "https://i.ibb.co/example/planta.jpg",
    "delete_url": "https://ibb.co/example/delete"
  }
}
```

---

## 7. Códigos de Estado HTTP

| Código | Significado | Descripción |
|---|---|---|
| `200` | OK | La solicitud se completó correctamente |
| `201` | Created | El recurso se ha creado exitosamente |
| `400` | Bad Request | Parámetros o cuerpo de la solicitud inválidos |
| `401` | Unauthorized | Falta token JWT o es inválido/expirado |
| `403` | Forbidden | No cuenta con permisos administrativos |
| `404` | Not Found | Recurso o ruta no encontrada |
| `500` | Server Error | Error interno del servidor |