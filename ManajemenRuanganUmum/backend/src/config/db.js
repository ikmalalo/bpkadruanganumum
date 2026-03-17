const mysql = require('mysql2/promise');

// 🔥 Pakai DATABASE_URL dari Railway
// Format: mysql://user:password@host:port/database
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = mysql.createPool(connectionString);
module.exports = pool;