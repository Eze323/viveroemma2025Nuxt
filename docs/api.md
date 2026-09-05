# Documentación de la API - Vivero Emma

Guía técnica completa y especificación de endpoints de la API de Vivero Emma.

---

## 1. Información General

- **URL Base:** `/api` (en producción redirigido vía proxy a `https://inventario-fabrica-backend.onrender.com/api`)
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

Las operaciones administrativas requieren autenticación mediante **JSON Web Token (JWT)** enviado en la cabecera `Authorization`:
```http
Authorization: Bearer <tu_token_jwt>
```

### Endpoints de Autenticación

#### `POST /api/auth/login`
Inicia sesión y genera el token de acceso.
- **Acceso:** Público
- **Cuerpo (Body):**
```json
{
  "email": "admin@viveroemma.com",
  "password": "tu_password_segura"
}
```

#### `GET /api/auth/user`
Obtiene los datos del usuario autenticado actual.
- **Acceso:** Privado (`Bearer Token`)

#### `POST /api/auth/logout`
Cierra la sesión del usuario.
- **Acceso:** Privado (`Bearer Token`)

---

## 3. Módulo de Productos (Plantas y Artículos)

### `GET /api/products`
Obtiene la lista de productos disponibles en catálogo.
- **Acceso:** Público / Privado
- **Parámetros de consulta (Query Params):**
  - `category` *(opcional)*: Filtra por categoría.
  - `search` *(opcional)*: Filtra por nombre o especie.

### `GET /api/products/:id`
Obtiene los datos detallados de un producto por su ID.

### `POST /api/products`
Crea una nueva planta o artículo en el catálogo.
- **Acceso:** Privado (`Bearer Token`)
- **Cuerpo (Body):**
```json
{
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
```

### `PUT /api/products/:id`
Actualiza un producto existente.
- **Acceso:** Privado (`Bearer Token`)

### `DELETE /api/products/:id`
Elimina un producto del catálogo.
- **Acceso:** Privado (`Bearer Token`)

---

## 4. Módulo de Ventas

### `GET /api/sales`
Historial de ventas registradas con sus ítems asociados.
- **Acceso:** Privado (`Bearer Token`)

### `POST /api/sales`
Registra una nueva venta.
- **Acceso:** Privado (`Bearer Token`)
- **Cuerpo (Body):**
```json
{
  "customer": "María López",
  "seller": "Romy",
  "date": "2026-09-05",
  "status": "Completada",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 13000
    }
  ]
}
```

---

## 5. Subida de Imágenes (ImgBB)

### `POST /api/upload/imgbb`
Sube una fotografía de planta o producto a ImgBB para obtener su URL CDN.
- **Acceso:** Privado (`Bearer Token`)
- **Formato:** `multipart/form-data`