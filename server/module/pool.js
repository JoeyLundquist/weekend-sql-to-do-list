const pg = require('pg');
const url = require('url')

let config = {};

if (process.env.DATABASE_URL) {
    config = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
} 
else {
    config = {
        host: 'localhost',
        port: 5432,
        database: 'weekend-to-do-app', 
      };
}

const pool = new pg.Pool(config);


pool.on('connect', () => {
    console.log('Postgesql connected');
  });
  

// const pool = new pg.Pool({
//     host: 'localhost', 
//     port: 5432,
//     database: process.env.DATABASE_NAME || 'weekend-to-do-app'
// })

pool.on('error', (err) => {
    console.log('Unexpected error on idle client', err);
    process.exit(-1);
  });

module.exports = pool;