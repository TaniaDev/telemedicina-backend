exports.up = async function (knex) {
    return await knex.schema.createTable('documento_medico', table => {
      table.uuid('id').primary().defaultTo(knex.raw("uuid_generate_v4()"))
      table.uuid('id_paciente').references('paciente.id_usuario').notNullable().onDelete('CASCADE')
      table.text('descricao').notNullable()

      table.timestamp('adicionado_em').defaultTo(knex.fn.now()).nullable()
      table.timestamp('atualizado_em').defaultTo(knex.fn.now()).nullable()
    })
  }
  
  exports.down = async function (knex) {
    return await knex.schema.dropTable('documento_medico');
  }
  