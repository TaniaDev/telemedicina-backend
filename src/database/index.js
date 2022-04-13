const knex = require('knex')

const knexfile = require('../config/knexfile')

const con = knex(knexfile.development)

module.exports = con
