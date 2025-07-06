# API del Vivero

## GET /api/products
- **Descripción**: Lista todas las plantas del inventario.
- **Autenticación**: Requiere token JWT (enviado en el header `Authorization: Bearer <token>`).
- **Parámetros**:
  - `type` (opcional): Filtra por tipo de planta (ej. `flor`, `suculenta`).
- **Respuesta**:
  ```json
  [
    {
      "id": 1,
      "name": "Rosa",
      "type": "Flor",
      "price": 10.99,
      "stock": 50
    }
  ]