const { Pool } = require('pg')

const pool = new Pool({
  host: "localhost",
  user: 'postgres',
  password: "crossmyheart1243",
  port: 5432,
  database: "varoliletisim",
  max: 20,
  connectionTimeoutMillis: 2000
})

module.exports = pool;