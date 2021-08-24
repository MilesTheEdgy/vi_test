// const Pool = require("pg").Pool;
const { Pool } = require('pg')

const { Client } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: 'postgres',
  password: "crossmyheart1243",
  port: 5432,
  database: "varoliletisim",
  max: 20,
  connectionTimeoutMillis: 2000
})

// const client = new Client({
//     user: "postgres",
//     password: "crossmyheart1243",
//     host: "localhost",
//     port: 5432,
//     database: "varoliletisim"
// })

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

module.exports = pool;