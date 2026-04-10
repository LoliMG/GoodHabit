import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    const config = process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432
    };
    
    console.log("Testing connection with:", { ...config, password: '****' });
    
    const client = new Client(config);
    try {
        await client.connect();
        console.log("CONNECTED SUCCESSFULLY");
        await client.end();
    } catch (e) {
        console.error("CONNECTION FAILED:", e.message);
    }
};

test();
