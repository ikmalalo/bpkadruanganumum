const mysql = require('mysql2/promise');
require('dotenv').config();

// Railway (and some other platforms) provide a single DATABASE_URL connection string.
// Example: mysql://user:pass@host:3306/dbname
const connectionString = process.env.DATABASE_URL;
let host = process.env.DB_HOST || 'mysql.railway.internal';
let user = process.env.DB_USER || 'root';
let password = process.env.DB_PASSWORD || 'wwMTekVOtrGrRvLsjvCGsohiPNITeHdj';
let database = process.env.DB_NAME || 'railway';
let port = process.env.DB_PORT || 3306;

if (connectionString) {
  try {
    const url = new URL(connectionString);
    host = url.hostname;
    port = url.port || port;
    user = decodeURIComponent(url.username);
    password = decodeURIComponent(url.password);
    database = url.pathname ? url.pathname.replace(/^\//, "") : database;
  } catch (err) {
    console.warn('Failed to parse DATABASE_URL, falling back to individual env vars', err.message);
  }
}

const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
