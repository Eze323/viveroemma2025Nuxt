# Vivero Emma - Sistema de Gestión

Sistema de gestión para Vivero Emma, desarrollado con Nuxt 3. Permite administrar ventas, productos, clientes y más.

## Tecnologías Principales

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Gestión de Estado**: [Pinia](https://pinia.vuejs.org/)
- **Base de Datos**: 
  - [Drizzle ORM](https://orm.drizzle.team/)
  - [Prisma](https://www.prisma.io/) (para algunas operaciones)
  - MySQL / SQLite (según configuración)
- **Autenticación**: JWT / Nuxt Auth Sanctum
- **Iconos**: [Nuxt Icon](https://nuxt.com/modules/icon)
- **Fuentes**: [Google Fonts](https://google-fonts.nuxtjs.org/) (Montserrat, Poppins, Playfair Display)

## Requisitos Previos

- Node.js (se recomienda la última versión estable)
- npm, yarn, pnpm o bun (este proyecto usa `bun` para algunas tareas, pero `npm` es el estándar definido en los scripts)

## Configuración del Proyecto

1. **Clonar el repositorio:**

```bash
git clone <url-del-repositorio>
cd viveroemma2025Nuxt
```

2. **Instalar dependencias:**

```bash
# npm
npm install

# o yarn
yarn install
```

3. **Variables de Entorno:**
   Crea un archivo `.env` en la raíz del proyecto basándote en la configuración requerida en `nuxt.config.ts`. Debería incluir variables como:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=vivero_emma
DB_USERNAME=root
DB_PASSWORD=tu_password
DATABASE_URL="mysql://root:tu_password@localhost:3306/vivero_emma" # Para Prisma/Drizzle

# API
API_BASE_URL=http://localhost:3000

# Auth
JWT_SECRET=tu_secreto_super_seguro
```

4. **Base de Datos:**
   Genera el cliente de Prisma y corre las migraciones si es necesario:

```bash
npx prisma generate
# o con bun
bunx prisma generate
```

## Desarrollo

Inicia el servidor de desarrollo en `http://localhost:3000`:

```bash
npm run dev
```

## Producción

Construye la aplicación para producción:

```bash
npm run build
```

Previsualiza la build de producción localmente:

```bash
npm run preview
```

## Características

- **Panel de Administración**: `/admin`
- **Gestión de Ventas**: Registro y consulta de ventas.
- **Catálogo de Productos**: Administración de inventario y precios.
- **Clientes**: Base de datos de clientes.
- **Reportes**: Visualización de datos y métricas.
