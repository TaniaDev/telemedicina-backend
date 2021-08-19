
exports.up = knex => knex.schema.createTable('usuario', table => {
      table.increments('id').primary();
      table.text('nome').unique().notNullable();

      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
exports.down = async knex => knex.schema.dropTable('usuario');
