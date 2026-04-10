import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Supabase usa SSL en producción
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool(process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: { 
        rejectUnauthorized: false 
    }
} : {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

/**
 * Execute a query in PostgreSQL
 * @param {string} text - SQL Query (using $1, $2 for placeholders)
 * @param {Array} params - Values to insert
 */
const executeQuery = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        // console.log('executed query', { text, duration, rows: res.rowCount });
        
        // Postgres devuelve resultados en 'rows'
        return res.rows;
    } catch (error) {
        console.error('Postgres Query Error:', error);
        throw error;
    }
};

export default executeQuery;
