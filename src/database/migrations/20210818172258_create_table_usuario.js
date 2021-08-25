exports.up = async function (knex) {
  return await knex.schema.createTable('usuario', table => {
      table.increments('id').primary();
      table.text('nome').notNullable();
      table.date('dt_nascimento').notNullable();
      table.text('genero').notNullable();
      table.text('email').unique().notNullable();
      table.text('senha').notNullable();

      table.timestamp('created_at').defaultTo(knex.fn.now()).nullable()
      table.timestamp('updated_at').defaultTo(knex.fn.now()).nullable()
  })
}
exports.down = async function (knex) {
  return await knex.schema.dropTable('usuario');
}
