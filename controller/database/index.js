// const Pool = require("pg").Pool;
const { Pool } = require('pg')

// const { Client } = require("pg");

// const client = new Client({
  //     user: "postgres",
//     password: "crossmyheart1243",
//     host: "localhost",
//     port: 5432,
//     database: "varoliletisim"
// })

/////////////////////////////////
const pool = new Pool({
  host: "localhost",
  user: 'postgres',
  password: "crossmyheart1243",
  port: 5432,
  database: "varoliletisim",
  max: 20,
  connectionTimeoutMillis: 2000
})
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

module.exports = pool;