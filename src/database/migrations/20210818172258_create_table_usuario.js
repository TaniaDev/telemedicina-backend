exports.up = async function (knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  return await knex.schema.createTable('usuario', table => {
      table.uuid('id').primary().defaultTo(knex.raw("uuid_generate_v4()"))
      table.text('nome').notNullable()
      table.date('dt_nascimento').notNullable()
      table.text('genero').notNullable()
      table.bigint('telefone').notNullable()
      table.text('email').unique().notNullable()
      table.text('senha').notNullable()
      table.text('tipo').notNullable()

      table.timestamp('criado_em').defaultTo(knex.fn.now()).nullable()
      table.timestamp('atualizado_em').defaultTo(knex.fn.now()).nullable()
  })
}

exports.down = async function (knex) {
  return await knex.schema.dropTable('usuario')
}
