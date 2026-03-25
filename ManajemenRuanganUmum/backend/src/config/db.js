const mysql = require('mysql2/promise');

// 🔥 Pakai DATABASE_URL dari Railway atau variabel terpisah
// Format: mysql://user:password@host:port/database
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Jika DATABASE_URL tidak ada, bangun dari variabel terpisah
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = process.env.DB_PORT || 3306; // Default port MySQL

  if (!host || !user || !password || !database) {
    throw new Error("Database configuration is incomplete. Please set DATABASE_URL or DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in environment variables");
  }

  connectionString = `mysql://${user}:${password}@${host}:${port}/${database}`;
}

const pool = mysql.createPool(connectionString);

module.exports = pool;