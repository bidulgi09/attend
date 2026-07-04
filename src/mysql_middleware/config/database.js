import dotenv from 'dotenv';

dotenv.config();

let dbconfig = {
    host: process.env.VITE_DB_HOST,
    user: process.env.VITE_DB_USER,
    password: process.env.VITE_DB_PASSWORD,
    database: process.env.VITE_DB_NAME,
    port: parseInt(process.env.VITE_DB_PORT || '12749', 10),
    ssl: {
       rejectUnauthorized: false
    }
}

console.log("=== DB 연결 설정 확인 ===");
console.log("HOST:", dbconfig.host);
console.log("PORT:", dbconfig.port);

export default dbconfig;