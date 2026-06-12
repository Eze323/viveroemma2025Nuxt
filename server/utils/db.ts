// // server/utils/db.ts
// import { drizzle } from 'drizzle-orm/mysql2';
// import mysql from 'mysql2/promise';

// //const config = useRuntimeConfig();

// // Crear un pool de conexiones
// const pool = mysql.createPool({
//     // host: config.public.DB_HOST,
//     // port: 3306,
//     // database: config.public.DB_DATABASE,
//     // user: config.public.DB_USER,
//     // password: config.public.DB_PASSWORD,
//     uri: process.env.DATABASE_URL , // Usar la URL de la base de datos
// });

// // Exportar la instancia de Drizzle
// export const db = drizzle(pool);