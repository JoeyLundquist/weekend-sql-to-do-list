const pg = require('pg');

const pool = new pg.Pool({
    host: 'localhost', 
    port: 5432,
    database: process.env.DATABASE_NAME || 'weekend-to-do-app'
})

module.exports = pool;