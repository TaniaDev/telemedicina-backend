const knex = require('knex');

const con = knex({
  client: 'pg',
  connection: {
    host : 'localhost',
    user : 'postgres',
    password : 'postgres',
    database : 'TELEMEDICINA'
  },
  pool: {
    min: 0,
    max: 7
  }
});

module.exports = con;