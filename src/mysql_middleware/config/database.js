module.exports = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "bidulgi",
    database: process.env.DB_NAME || "main",
    port: process.env.DB_PORT || 3306
}