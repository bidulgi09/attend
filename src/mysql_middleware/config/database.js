import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

let dbconfig = {
    host: process.env.VITE_DB_HOST,
    user: process.env.VITE_DB_USER,
    password: process.env.VITE_DB_PASSWORD,
    database: process.env.VITE_DB_NAME,
    port: process.env.VITE_DB_PORT,
    ssl: {
       rejectUnauthorized: false
    }
}

export default dbconfig;