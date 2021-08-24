const knex = require('knex')
const knexfile = require('../../knexfile');

const con = knex(knexfile.development)

module.exports = con;
