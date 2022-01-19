module.exports = {
  development: {
    client: 'pg',
    connection: {
      host : 'localhost',
      database: 'telemedicina',
      user: 'postgres',
      password: 'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/database/migrations`
    },
    seeds: {
      directory: `${__dirname}/src/database/seeds`
    }
  }
}
