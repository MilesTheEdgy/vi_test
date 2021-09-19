const { Pool } = require('pg')

const pool = new Pool({
  host: "db",
  user: 'postgres',
  password: "crossmyheart1243",
  port: 5432,
  database: "varoliletisim",
  max: 20,
  connectionTimeoutMillis: 2000
})
<<<<<<< HEAD
=======
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });
>>>>>>> c55b5c51fa9904409338457d3309f9233b7ad2ba

module.exports = pool;